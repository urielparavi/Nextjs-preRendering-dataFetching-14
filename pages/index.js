import Head from 'next/head';
import EventList from '../components/events/event-list';
import { getFeaturedEvents } from '../helpers/api-util';

function HomePage(props) {
  return (
    <div>
      <Head>
        <title>NextJS Events</title>
        <meta
          name="description"
          content="Find a lot of great events that allow you to evolve.."
        />
      </Head>
      <EventList items={props.events} />
    </div>
  );
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();

  return {
    props: {
      events: featuredEvents,
    },
    // Regenerate the page in the background if a request comes in
    // 30 minutes (1800 seconds) after the last regeneration.
    // This enables Incremental Static Regeneration (ISR).
    revalidate: 1800,
  };
}

export default HomePage;
