import Modal from './modal';
import System from './system';
import Config from './config';

const RootState = [
    ...Modal,
    ...System,
    ...Config,
];


export default RootState;