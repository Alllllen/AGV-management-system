import axios from 'axios';
import { showAlert } from './alert';

export const getAssignment = async (
  rangeBy,
  filterBy,
  filterWord,
  taskId,
  page
) => {
  let ifTask = 'notask';
  if (taskId) ifTask = 'task';

  let assignmentAll = await axios({
    method: 'GET',
    url: `/api/v1/assignment?${ifTask}=${taskId}&${filterBy}=${filterWord}`,
  });

  let assignments = await axios({
    method: 'GET',
    url: `/api/v1/assignment?${ifTask}=${taskId}&${filterBy}=${filterWord}&sort=${rangeBy}&limit=10&page=${page}`,
  });

  assignmentAll = assignmentAll.data.data.data;
  assignments = assignments.data.data.data;
  const tbl = document.querySelector('.assignmentHistorytable');

  tbl.innerHTML = '';
  for (let i = 0; i < assignments.length; i++) {
    let tr = document.createElement('tr');
    let td = document.createElement('td');

    td.innerHTML = i;
    tr.appendChild(td.cloneNode(true));

    td.innerHTML = assignments[i].task;
    tr.appendChild(td.cloneNode(true));

    td.innerHTML = assignments[i].routeStart;
    tr.appendChild(td.cloneNode(true));

    td.innerHTML = assignments[i].routeEnd;
    tr.appendChild(td.cloneNode(true));

    td.innerHTML = assignments[i].agv;
    tr.appendChild(td.cloneNode(true));

    td.innerHTML = new Date(assignments[i].createdAt).toLocaleString();
    tr.appendChild(td.cloneNode(true));

    td.innerHTML = assignments[i].status;
    tr.appendChild(td.cloneNode(true));

    tbl.appendChild(tr);
  }

  const assignmentPagination = document.querySelector('.assignmentPagination');
  assignmentPagination.innerHTML = '';
  let num = Math.ceil(assignmentAll.length / 10);

  for (let i = 1; i <= num; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    li.classList.add('page-item', 'page-link');
    a.id = 'assignmentPaginationBtn' + i;
    a.innerHTML = i;

    a.addEventListener('click', () =>
      getAssignment(rangeBy, filterBy, filterWord, taskId, Number(a.innerHTML))
    );
    li.appendChild(a);
    assignmentPagination.appendChild(li);
  }
};
