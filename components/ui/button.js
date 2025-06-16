import Link from 'next/link';

import classes from './button.module.css';

function Button({ children, link, onClick }) {
  if (link) {
    return (
      <Link className={classes.btn} href={link}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes.btn} href={link}>
      {children}
    </button>
  );
}

export default Button;
