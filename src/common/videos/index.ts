import introVideo from './CAPTIONED_01_Intro video_What is E-Surveyor_Assemble_V7_020926_mobile_1080p_hevc_small.mp4';
import setupVideo from './CAPTIONED_02_Setting Up Your Moth Trap_Assemble_V11_020926_mobile_1080p_hevc_small.mp4';
import placeVideo from './CAPTIONED_03_Where To Place Your Moth Trap_Assemble_V9_020926_mobile_1080p_hevc_small.mp4';
import recordVideo from './CAPTIONED_04_Recording moths in the morning_Assemble_V9_020926_mobile_1080p_hevc_small.mp4';
import packVideo from './CAPTIONED_05_Packing Away_Assemble_V7_020926_mobile_1080p_hevc_small.mp4';
import introPoster from './intro.jpg';
import packPoster from './pack.jpg';
import placePoster from './place.jpg';
import recordPoster from './record.jpg';
import setupPoster from './setup.jpg';

export const INTRO_VIDEO = {
  title: 'What is e-Surveyor?',
  src: introVideo,
  poster: introPoster,
  duration: '1:30',
};

export const MOTH_VIDEOS = [
  {
    title: 'Setting up your moth trap',
    src: setupVideo,
    poster: setupPoster,
    duration: '2:00',
    points: [
      'Assemble the funnel, LEDs and rain guard',
      'Place the egg cartons inside',
      'Check the battery: all bars should light up',
    ],
  },
  {
    title: 'Where to put your moth trap',
    src: placeVideo,
    poster: placePoster,
    duration: '2:00',
    points: [
      'Open but sheltered spot, out of rain and strong wind',
      'Put it out before dusk and leave it overnight',
      'Keep traps at least 100 m apart',
    ],
  },
  {
    title: 'Recording moths in the morning',
    src: recordVideo,
    poster: recordPoster,
    duration: '2:00',
    points: [
      'Check inside the trap, the egg cartons and nearby ground',
      'Take one top-down photo per moth',
      'Low confidence? Delete the record and try again',
      'Release moths after recording',
    ],
  },
  {
    title: 'Your data and packing away',
    src: packVideo,
    poster: packPoster,
    duration: '1:30',
    points: [
      'Repeat ideally weekly, but not on the same spot two nights running',
      'Store the trap dry and indoors',
      'Recharge batteries between uses',
    ],
  },
];
