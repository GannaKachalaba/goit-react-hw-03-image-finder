import { MdOutlineDragIndicator } from 'react-icons/md';
import css from './Loader.module.css';

function Loader() {
  return (
    <div className={css.wrapper}>
      <MdOutlineDragIndicator className={css.loader} />
    </div>
  );
}

export default Loader;
