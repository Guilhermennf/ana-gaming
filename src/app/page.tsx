'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import imageInitialPageHero from '@/assets/imgs/image-initial-page-hero.png';
import { Game } from '@/lib/api';
import { getSportIcon } from '@/components/Sidebar/Sidebar';
import { convertAmericanToDecimal, formatDate } from '@/tools/formats';
import { usePopularSports, useEvents } from '@/lib/queries';

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'featured' | 'live'>('featured');

  const { data: popularSports = [], isLoading: loadingSports } =
    usePopularSports(6);

  const { data: eventsData, isLoading: loadingEvents } = useEvents(3, 5);

  const featuredEvents: Game[] = eventsData?.featured || [];
  const liveEvents: Game[] = eventsData?.live || [];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-70 hidden md:block">
          <Image
            src={imageInitialPageHero}
            alt="Estádio de futebol"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-4xl font-bold mb-4">
              Compare as Melhores Odds de Apostas Esportivas do Brasil
            </h1>
            <p className="text-lg md:text-lg mb-6">
              Encontre as melhores odds de apostas do Brasil.
            </p>
            <div className="bg-green-500 inline-block py-3 px-6 rounded-lg font-bold text-sm md:text-base">
              GARANTA ATÉ R$ 1.000 EM BÔNUS PARA APOSTAR
            </div>
            <div className="mt-4">
              {!session && (
                <button
                  onClick={() => signIn('github')}
                  className="bg-white text-green-700 py-2 px-6 rounded-lg font-medium flex items-center"
                >
                  Crie sua conta
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="md:hidden flex justify-end items-center mb-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="bg-white p-2 rounded-md shadow text-gray-600 flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span>Filtros</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div
            className={`${showSidebar ? 'block' : 'hidden'} md:block md:w-1/4 transition-all duration-300`}
          >
            <Sidebar />
          </div>

          <div className="md:w-3/4">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h2 className="md:text-xl sm:text-md font-medium text-green-600">
                    Esportes Populares
                  </h2>
                </div>
                <Link
                  href="/sports"
                  className="text-green-600 flex items-center md:text-md sm:text-sm"
                >
                  Veja mais
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>

              {loadingSports ? (
                <div className="flex justify-center py-10">
                  <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {popularSports.map((sport) => (
                    <Link
                      key={sport.key}
                      href={`/sports/${sport.key}`}
                      className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:bg-green-50 transition-colors"
                    >
                      <div className="text-green-600 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </div>
                      <span className="text-center font-medium text-gray-800">
                        {sport.title}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {sport.group}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                  <h2 className="md:text-xl sm:text-md font-medium text-green-600">
                    As melhores promoções hoje no Brasil
                  </h2>
                </div>
                <Link
                  href="/sports"
                  className="text-green-600 flex items-center md:text-md sm:text-sm"
                >
                  Veja mais
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-black">Novibet</div>
                      <div className="bg-green-500 text-white text-sm rounded-full px-2 py-1">
                        4.8
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="text-lg md:text-lg font-medium text-gray-600">
                      100% até R$100
                    </div>
                    <div className="text-gray-600">Cashback</div>
                  </div>
                  <div className="px-4 pb-4 mt-auto">
                    <button className="bg-green-500 text-white py-2 px-4 rounded w-full flex justify-center items-center">
                      <span className="mr-1">Obter Bônus</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-black">BetMGM</div>
                      <div className="bg-green-500 text-white text-sm rounded-full px-2 py-1">
                        4.9
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="text-lg md:text-lg font-medium text-gray-600">
                      Lucro Turbinado!
                    </div>
                  </div>
                  <div className="px-4 pb-4 mt-auto">
                    <button className="bg-green-500 text-white py-2 px-4 rounded w-full flex justify-center items-center">
                      <span className="mr-1">Obter Bônus</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-black">Superbet</div>
                      <div className="bg-green-500 text-white text-sm rounded-full px-2 py-1">
                        4.7
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="text-lg md:text-lg  font-medium text-gray-600">
                      SuperCombinada até 100%
                    </div>
                  </div>
                  <div className="px-4 pb-4 mt-auto">
                    <button className="bg-green-500 text-white py-2 px-4 rounded w-full flex justify-center items-center">
                      <span className="mr-1">Obter Bônus</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between mb-4">
                <div className="flex space-x-6 mb-2 md:mb-0 overflow-x-auto w-full md:w-auto pb-2">
                  <button
                    onClick={() => setActiveTab('featured')}
                    className={`flex items-center space-x-2 font-medium pb-2 text-sm md:text-base ${
                      activeTab === 'featured'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>Eventos em destaque</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('live')}
                    className={`flex items-center space-x-2 font-medium pb-2 text-sm md:text-base ${
                      activeTab === 'live'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                    <span>Ao vivo</span>
                  </button>
                </div>
              </div>

              {loadingEvents ? (
                <div className="flex justify-center py-10">
                  <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="mb-8">
                  {activeTab === 'featured' && featuredEvents.length > 0 && (
                    <>
                      {featuredEvents.map((game, index) => {
                        const sportIcon = getSportIcon(game.sport_key);
                        const date = formatDate(game.commence_time);
                        const homeOdds =
                          game.bookmakers[0]?.markets[0]?.outcomes.find(
                            (o) => o.name === game.home_team
                          )?.price || 0;
                        const drawOdds =
                          game.bookmakers[0]?.markets[0]?.outcomes.find(
                            (o) =>
                              o.name !== game.home_team &&
                              o.name !== game.away_team
                          )?.price;
                        const awayOdds =
                          game.bookmakers[0]?.markets[0]?.outcomes.find(
                            (o) => o.name === game.away_team
                          )?.price || 0;

                        return (
                          <div
                            key={game.id}
                            className={index === 0 ? '' : 'mt-4'}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-xl text-green-600">
                                {sportIcon}
                              </span>
                              <h3 className="font-medium text-gray-600 text-sm md:text-base">
                                {game.sport_title}
                              </h3>
                            </div>
                            <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
                              <Link
                                href={`/match/${game.id}`}
                                className="block"
                              >
                                <div className="grid grid-cols-12 sm:p-4 p-3">
                                  <div className="col-span-2 sm:col-span-2 text-sm md:text-sm text-gray-500">
                                    <div>{date}</div>
                                  </div>
                                  <div className="col-span-10 sm:col-span-4 flex flex-col mb-3 sm:mb-0">
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-4 h-4 text-green-600"
                                      >
                                        <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
                                      </svg>
                                      <span className="font-medium text-green-600 text-sm md:text-base">
                                        {game.home_team}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-4 h-4 text-green-600"
                                      >
                                        <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
                                      </svg>
                                      <span className="font-medium text-green-600 text-sm md:text-base">
                                        {game.away_team}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-span-12 sm:col-span-6 grid grid-cols-3 gap-2">
                                    <div className="bg-gray-50 p-2 rounded text-center">
                                      <div className="text-sm  md:text-sm text-gray-500">
                                        1
                                      </div>
                                      <div className="font-bold text-gray-600 text-sm md:text-base">
                                        {convertAmericanToDecimal(homeOdds)}
                                      </div>
                                    </div>
                                    {drawOdds ? (
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <div className="text-sm  md:text-sm text-gray-500">
                                          X
                                        </div>
                                        <div className="font-bold text-gray-600 text-sm md:text-base">
                                          {convertAmericanToDecimal(drawOdds)}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="hidden sm:block"></div>
                                    )}
                                    <div className="bg-gray-50 p-2 rounded text-center">
                                      <div className="text-sm  md:text-sm text-gray-500">
                                        2
                                      </div>
                                      <div className="font-bold text-gray-600 text-sm md:text-base">
                                        {convertAmericanToDecimal(awayOdds)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {activeTab === 'live' && liveEvents.length > 0 && (
                    <>
                      {liveEvents.map((game, index) => {
                        const sportIcon = getSportIcon(game.sport_key);
                        const date = formatDate(game.commence_time);
                        const homeOdds =
                          game.bookmakers[0]?.markets[0]?.outcomes.find(
                            (o) => o.name === game.home_team
                          )?.price || 0;
                        const drawOdds =
                          game.bookmakers[0]?.markets[0]?.outcomes.find(
                            (o) =>
                              o.name !== game.home_team &&
                              o.name !== game.away_team
                          )?.price;
                        const awayOdds =
                          game.bookmakers[0]?.markets[0]?.outcomes.find(
                            (o) => o.name === game.away_team
                          )?.price || 0;

                        return (
                          <div
                            key={game.id}
                            className={index === 0 ? '' : 'mt-4'}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-xl text-green-600">
                                {sportIcon}
                              </span>
                              <h3 className="font-medium text-gray-600 text-sm md:text-base">
                                {game.sport_title}
                              </h3>
                              <span className="inline-flex items-center bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                                <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative">AO VIVO</span>
                              </span>
                            </div>
                            <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
                              <Link
                                href={`/match/${game.id}`}
                                className="block"
                              >
                                <div className="grid grid-cols-12 sm:p-4 p-3">
                                  <div className="col-span-2 sm:col-span-2 text-sm md:text-sm text-gray-500">
                                    <div>{date}</div>
                                  </div>
                                  <div className="col-span-10 sm:col-span-4 flex flex-col mb-3 sm:mb-0">
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-4 h-4 text-green-600"
                                      >
                                        <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
                                      </svg>
                                      <span className="font-medium text-green-600 text-sm md:text-base">
                                        {game.home_team}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-4 h-4 text-green-600"
                                      >
                                        <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
                                      </svg>
                                      <span className="font-medium text-green-600 text-sm md:text-base">
                                        {game.away_team}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-span-12 sm:col-span-6 grid grid-cols-3 gap-2">
                                    <div className="bg-gray-50 p-2 rounded text-center">
                                      <div className="text-sm  md:text-sm text-gray-500">
                                        1
                                      </div>
                                      <div className="font-bold text-gray-600 text-sm md:text-base">
                                        {convertAmericanToDecimal(homeOdds)}
                                      </div>
                                    </div>
                                    {drawOdds ? (
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <div className="text-sm md:text-sm text-gray-500">
                                          X
                                        </div>
                                        <div className="font-bold text-gray-600 text-sm md:text-base">
                                          {convertAmericanToDecimal(drawOdds)}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="hidden sm:block"></div>
                                    )}
                                    <div className="bg-gray-50 p-2 rounded text-center">
                                      <div className="text-sm  md:text-sm text-gray-500">
                                        2
                                      </div>
                                      <div className="font-bold text-gray-600 text-sm md:text-base">
                                        {convertAmericanToDecimal(awayOdds)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {activeTab === 'featured' && featuredEvents.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded">
                      Não há eventos em destaque disponíveis no momento.
                    </div>
                  )}

                  {activeTab === 'live' && liveEvents.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded">
                      Não há eventos ao vivo disponíveis no momento.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
