//import { Header } from "../components/Header/Index";

/** SSG
export default function Home(props) {
  return (
    <div>
      <div>Index</div>
      <p>{ JSON.stringify(props.episodes) }</p>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    }
  }
}
*/

/** SSR
export default function Home(props) {
  console.log(props.episodes)
  
  return (
    <h1>Index</h1>
  )
}

export async function getServerSideProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()
    
  return {
    props: {
      episodes: data,
    }
  }
}
*/

/** SPA

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
  fetch('http://localhost:3333/episodes')
    .then (response => response.json())
    .then (data => console.log(data))
  }, [])
    
  return (
    <h1>Index</h1>
  )
}
*/

import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  episodes: Array<Episode>
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <div>Index</div>
      <p>{ JSON.stringify(props.episodes) }</p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  })

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  }
}