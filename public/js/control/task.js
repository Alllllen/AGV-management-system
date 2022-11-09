import axios from 'axios';
import { showAlert } from './alert';

export const section = (Floors, state) => {
  Array.prototype.forEach.call(Floors, (element) => {
    element.addEventListener('click', async () => {
      const floorBtn = `.${state}FloorBtn`;
      const blockBtn = `.${state}BlockBtn`;
      const sectionBtn = `.${state}SectionBtn`;

      const blockElement = `${state}Block`;
      const sectionElement = `${state}Section`;

      const BlockList = document.querySelector(`.${state}BlockList`);
      const SectionList = document.querySelector(`.${state}SectionList`);

      //把button改成你點選的list elements
      const btnFloor = document.querySelector(floorBtn);
      btnFloor.innerHTML = element.innerHTML;
      btnFloor.id = 1;

      //先清除block list 中的elements 好列出新選的樓層的blocks
      const blockElements = document.querySelectorAll('.' + blockElement);
      blockElements.forEach((el) => {
        el.remove();
      });

      //找出該樓層的所有blocks
      let blocks = await axios({
        method: 'GET',
        url: `/api/v1/Block/?z=${Number(element.innerHTML.split('Floor ')[1])}`,
      });
      blocks = blocks.data.data.data;

      for (let block of blocks) {
        const a = document.createElement('a');

        a.classList.add(blockElement, 'dropdown-item');
        a.setAttribute('href', '#');
        a.id = block._id;
        a.innerHTML = block.name;

        a.addEventListener('click', async () => {
          const btnBlock = document.querySelector(blockBtn);
          btnBlock.innerHTML = a.innerHTML;
          btnBlock.id = a.id;

          const sectionElements = document.querySelectorAll(
            '.' + sectionElement
          );
          sectionElements.forEach((el) => {
            el.remove();
          });

          //找出該lock的所有sections
          let sections = await axios({
            method: 'GET',
            url: `/api/v1/block/${a.id}`,
          });
          sections = sections.data.data.data.sections;

          for (let section of sections) {
            const a = document.createElement('a');

            a.classList.add(sectionElement, 'dropdown-item');
            a.setAttribute('href', '#');
            a.id = section._id;
            a.innerHTML = section.name;
            a.addEventListener('click', async () => {
              const btnSection = document.querySelector(sectionBtn);
              btnSection.innerHTML = a.innerHTML;
              btnSection.id = a.id;
            });
            SectionList.appendChild(a);
          }
        });

        BlockList.appendChild(a);
      }
    });
  });
};

export const createTask = async (startSection, endSection) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/task',
      data: { sectionStart: startSection, sectionEnd: endSection },
    });

    if (res.data.status === 'success') {
      showAlert('Create successfully!');
      window.setTimeout(() => {
        location.assign('/createTask');
      }, 1500);
    }
  } catch (err) {
    showAlert('Input not complete');
  }
};