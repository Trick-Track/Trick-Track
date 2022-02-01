import {initialBpm} from './bpm.js';
import {initialBeats, addBeatsHandlers} from './beats.js';
import {playSound} from './player.js';
import {setProjectDisabledSteps, setProjectNamePlaceHolder} from './project.js';
import {addControlsHandlers, removeControlsHandlers} from './controls.js';
import {addArrowsHandlers} from './slider.js';
import {ProjectItem} from './project-item.js';


const sequencer = document.querySelector('.sequencer__wrapper');
const sampleList = sequencer.querySelector('.sequencer__samples-list');
const sampleTemplate = document.querySelector('#matrix').content.querySelector('.sequencer__samples-item');
const projectsList = document.querySelector('.app__project-list');


const renderCell = () => {
  const cellElement = document.createElement('button');
  cellElement.classList.add('sequencer__cell');
  cellElement.type = 'button';

  return cellElement;
};


const fillSlideByCellsElements = (fragment) => {
  const cellElement = renderCell();
  fragment.append(cellElement);
};


const fillStep = (stepsList, cells) => {
  const fragment = document.createDocumentFragment();
  const fragmentOne = document.createDocumentFragment();
  cells.slice(0, 16).forEach((cell) => {
    fillSlideByCellsElements(fragment);
  });

  cells.slice(16, 32).forEach((cell) => {
    fillSlideByCellsElements(fragmentOne);
  });
  stepsList[0].append(fragment);
  stepsList[1].append(fragmentOne);
};


const renderLane = (lane) => {
  const{sound, cells, volume, panner} = lane;
  const newSample = sampleTemplate.cloneNode(true);
  newSample.querySelector('.button').textContent = sound.replace(/^.*[\\/]/, '').slice(0, -4);
  newSample.querySelector('[data-action="volume"]').value = volume;
  newSample.querySelector('.sequencer__controls-label-img').style.transform = 'rotate(' + panner * 90 + 'deg)';

  sampleList.append(newSample);

  const stepsList = newSample.querySelectorAll('.sequencer__steps-list');

  fillStep(stepsList, cells);
};


const renderProject = (project) => {
  initialBeats(project);

  let {lanes, bpm, name} = project;

  bpm = initialBpm(project);
  name =  setProjectNamePlaceHolder(project);

  lanes.forEach((lane) => {
    renderLane(lane);
  });
};


const createCellsElementsArray = (project, cb) => {
  const laneElements = document.getElementById('#sequencer-list').children;

  const laneCells = [];
  for (let i = 0; i < laneElements.length; i++) {
    const cells = laneElements[i].querySelectorAll('.sequencer__cell');
    laneCells.push(cells);
    setCellBackgroundColor(laneCells);
  }
  cb(project, laneCells);
};


const setCellBackgroundColor = (cellsButtons) => {
  cellsButtons.forEach((cellsButtonsOfLane) => {
    for (let i = 0; i < cellsButtonsOfLane.length; i++) {
      if (Math.floor((i / 4) % 2) == 0) {
        cellsButtonsOfLane[i].classList.add('sequencer__cell--even-quarter');
      }
      else {cellsButtonsOfLane[i].classList.add('sequencer__cell--odd-quarter');
      }
    }
  });
};


const addButtonCellHandler = (project, cellsButtons, callback) => {
  const {lanes} = project;
  cellsButtons.forEach((cellsButtonsOfLane) => {
    const i = cellsButtons.indexOf(cellsButtonsOfLane, 0);
    const {cells} = lanes[i];
    cellsButtonsOfLane.forEach((cellElement) => cellElement.addEventListener('click', (evt) => {
      const cellElement = evt.target;
      const j = [...cellsButtonsOfLane].indexOf(cellElement, 0);

      cells[j].checked = cells[j].checked ? false : true;
      callback(project, cellsButtons);
    }));
  });
};


const renderStateCellElement = function (project, cellsButtons) {
  const {lanes} = project;
  for (let i = 0; i < lanes.length; i++) {
    const {cells} = lanes[i];
    for (let j = 0; j < cells.length; j++) {
      const thisButton = cellsButtons[i][j];
      cells[j].disabled == true ? thisButton.classList.add('sequencer__cell--disabled') && thisButton.disabled == true : thisButton.classList.remove('sequencer__cell--disabled') && thisButton.disabled == false;
      cells[j].checked == true ? thisButton.classList.add('sequencer__cell--checked') : thisButton.classList.remove('sequencer__cell--checked');
    }
  }
};


const createPlaybackElement = () => {
  const playbackStep = document.createElement('div');
  playbackStep.classList.add('sequencer__playback-element');
  return playbackStep;
};


const createPlaybackElementsWrapper = (n) => {
  const playbackList = document.createElement('div');
  playbackList.classList.add('sequencer__playback-list');

  for (let i = 0; i < n ; i++) {
    const playbackStep = createPlaybackElement();
    playbackList.append(playbackStep);
  }
  return playbackList;
};


const renderPlaybackLine = () => {
  const playbackWrapperFirst = document.querySelector('.slide-1');
  const playbackWrapperSecond = document.querySelector('.slide-2');

  const fragment = document.createDocumentFragment();
  const fragmentOne = document.createDocumentFragment();
  fragment.append(createPlaybackElementsWrapper(16));
  fragmentOne.append(createPlaybackElementsWrapper(16));

  playbackWrapperFirst.append(fragment);
  playbackWrapperSecond.append(fragmentOne);
};


const fillCurrentPlaybackStep = (step) => {
  const playbackSteps = document.querySelectorAll('.sequencer__playback-element');
  [...playbackSteps].forEach((playbackStep) => {
    const currentStep = playbackSteps[step];
    playbackStep == currentStep ? playbackStep.classList.add('sequencer__playback-element--played') : playbackStep.classList.remove('sequencer__playback-element--played');
  });
};


const getAllSoundsButtons = () => {
  let button = document.getElementsByClassName('button');
  let allSoundsButtons = [];
  allSoundsButtons.push.apply(allSoundsButtons, button);
  return allSoundsButtons;
};


const addSoundsButtonHandlers = (project) => {
  let allSoundsButtons = getAllSoundsButtons();

  allSoundsButtons.forEach((btn) => {
    btn.addEventListener('click', (evt) => {
      btn = evt.target;
      const i = allSoundsButtons.indexOf(btn, 0);

      context.resume().then(() => {
        playSound(buffer.getSound(i), 0, project);

      });

    });
  });
};


const addButtonCellsHandlers = function(project, cellsButtons) {
  renderStateCellElement(project, cellsButtons);
  addButtonCellHandler(project, cellsButtons, renderStateCellElement);
  addBeatsHandlers(() => setProjectDisabledSteps(project, () => {renderStateCellElement(project, cellsButtons);}));
};


const renderInitialProject = (project) =>  {
  renderProject(project);
  renderPlaybackLine();
  createCellsElementsArray(project, addButtonCellsHandlers);
  addSoundsButtonHandlers(project);
  addControlsHandlers(project);
  addArrowsHandlers();
};


const renderProjectList = (projects) => {
  projects.forEach((project) => {
    const rendererProject = project.fields;
    rendererProject['pk'] = project.pk;
    new ProjectItem(rendererProject).render();
  });
};


const rerenderUpdatedProjectList = (projects) => {
  projects.find((project) => {
    if(project.pk == currentProject.pk) {
      new ProjectItem(currentProject).rerenderSavedProjecItem(project);
    }
  });
};


const rerenderDeletedProjectList = (projects) => {
  const items = document.querySelectorAll('.app__project-link');
  let idItems = [...items].map((item) => {
    return item.dataset.pk;
  });

  const g = [];
  let i = 0;
  let some;

  while (i < projects.length) {
    some = projects[i].pk;
    const noDeletedItem = [...items].find(item => some == item.dataset.pk);

    if (noDeletedItem) {
      i++;
    }
    g.push(noDeletedItem.dataset.pk);
  }

  idItems = idItems.filter(e => !~g.indexOf(e));
  projectsList.removeChild(document.querySelector(`[data-pk="${idItems[0]}"]`).parentNode);
};


const removeOldEventListeners = () => {
  const laneElements = document.getElementById('#sequencer-list').children;
  const laneCells = [];
  for (let i = 0; i < laneElements.length; i++) {
    const cells = laneElements[i].querySelectorAll('.sequencer__cell');
    laneCells.push(cells);
  }

  laneCells.forEach((evt) => removeEventListener('click', (evt)));
  removeControlsHandlers();
};


const resetProjectRendering= () => {
  const projectLanesElements = document.querySelectorAll('.sequencer__samples-item');
  for (let i = 0; i < projectLanesElements.length; i++) {
    sampleList.removeChild(projectLanesElements[i]);
  }
};


export {fillCurrentPlaybackStep, renderProject, renderInitialProject, removeOldEventListeners, resetProjectRendering, renderProjectList, rerenderDeletedProjectList, rerenderUpdatedProjectList};
