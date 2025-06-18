import classes from './event-item.module.css';
import Button from '../ui/button';
import DateIcon from '../icons/date-icon';
import AddressIcon from '../icons/address-icon';
import ArrowRightIcon from '../icons/arrow-right-icon';
import Image from 'next/image';

function EventItem(props) {
  const { title, image, date, location, id } = props;

  // In general, the Date constructor parses the date string and creates a Date object.
  // If the string includes a time (e.g., '2025-06-14T10:30:00'), the Date object will include that time.
  // If the string includes only a date (e.g., '2025-06-14'), the time defaults to midnight (00:00:00).

  // toLocaleDateString => Convert the raw date string into a localized, human-readable format,
  // e.g., "2025-06-14" → "June 14, 2025", based on the specified locale and formatting options.
  const humanReadableDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Replace the comma and space in the location string with a line break,
  // so that the address is displayed on two lines instead of one.
  // e.g., "Tel Aviv, Israel" → "Tel Aviv\nIsrael"
  const formattedAddress = location.replace(', ', '\n');

  // Create a dynamic URL string for the event details page using the event's ID.
  // For example, if id = 'e1', the URL will be '/events/e1'.
  const exploreLink = `/events/${id}`;

  return (
    <li className={classes.item}>
      {/* 
      We don't include 'public' in the path because Next.js serves all files
      inside the 'public' folder at the root '/' URL automatically.

      Also, we don't hardcode the 'images' folder here because the 'image' variable
      already contains the relative path inside 'public', including the folder name.
      This way, the path is dynamic and flexible.

      Example:
      If image = 'images/event1.jpg',
      then src = '/images/event1.jpg' and Next.js will correctly serve the file from 'public/images/event1.jpg'.

      So, the full physical path on disk is 'public/images/event1.jpg', 
      because the 'public' folder maps directly to the root URL ('/').
    */}
      <Image src={'/' + image} alt={title} width={250} height={160} />
      <div className={classes.content}>
        <div className={classes.summary}>
          <h2>{title}</h2>
          <div className={classes.date}>
            <DateIcon />
            <time>{humanReadableDate}</time>
          </div>
          <div className={classes.address}>
            <AddressIcon />
            <address>{formattedAddress}</address>
          </div>
        </div>
        <div className={classes.actions}>
          <Button link={exploreLink}>
            <span>Explore Event</span>
            <span className={classes.icon}>
              <ArrowRightIcon />
            </span>
          </Button>
        </div>
      </div>
    </li>
  );
}

export default EventItem;
