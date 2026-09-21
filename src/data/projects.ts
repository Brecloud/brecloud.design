// EXPORTS: IProject, ISection, PROJECTS, SECTIONS
// 项目与区块数据——图片来自 /images/works/作品集-张盟-2026_PageN.png

export interface IProject {
  id: string;
  name: string;
  title: string;
  english: string;
  color: string;
  role: string;
  year: string;
  pages: string[];
  description: string;
}

export interface ISection {
  id: string;
  label: string;
  en: string;
  type: 'home' | 'project' | 'other' | 'about';
  projectId?: string;
}

const BASE = (import.meta.env.MIAODA_CLIENT_BASE_PATH || '').replace(/\/$/, '') + '/';

function img(n: number) {
  return `${BASE}images/works/作品集-张盟-2026_Page${n}.png`;
}

export const PROJECTS: IProject[] = [
  {
    id: 'xiao',
    name: 'XIAO.',
    title: '裁竹',
    english: 'Concept Modular Car Exterior',
    color: '#7FB069',
    role: 'Ideation / Sketching / AI-Rendering / Revisions',
    year: '2025',
    pages: [img(4), img(5), img(6), img(7), img(8), img(9)],
    description: '以中国竹文化与侠士文化为精神源头的东方美学概念汽车外饰设计。"裁竹为锋、寻觅逍遥"。',
  },
  {
    id: 'ava',
    name: 'AVA.',
    title: '空中医疗救援 eVTOL',
    english: 'Airborne Vital Aid',
    color: '#e63946',
    role: 'Survey / Analysis / Sketch / Modeling / AI-Rendering',
    year: '2026',
    pages: [img(10), img(11), img(12), img(13), img(14), img(15), img(16), img(17), img(18)],
    description: '针对城市地面救援延误痛点的空中生命救援 eVTOL 系统设计。',
  },
  {
    id: 'nook',
    name: 'NOOK.',
    title: '户外集成音频折叠凳',
    english: 'Outdoor Integrated Audio Stool',
    color: '#e8833a',
    role: 'Ideation / Surveying / Sketching / Modeling',
    year: '2026',
    pages: [img(19), img(20), img(21), img(22), img(23), img(24), img(25)],
    description: '面向社区老年人的"休憩+小型音响"二合一可折叠户外凳，包容性设计。',
  },
  {
    id: 'tomo',
    name: 'TOMO-img',
    title: '图谋 · 图片协作 iOS App',
    english: 'Focus on Img',
    color: '#E32B00',
    role: 'Surveying / UI / Prototyping / VibeCoding',
    year: '2026',
    pages: [img(26), img(27), img(28), img(29), img(30), img(31), img(32), img(33)],
    description: '围绕图片的实时语音讨论 iOS App——"随时随地，一起图谋"。',
  },
];

export const OTHER_PAGES: string[] = [
  img(34), img(35), img(36), img(37),
];

export const AI_PAGE: string = img(38);

export const SECTIONS: ISection[] = [
  { id: 'home', label: '首页', en: 'HOME', type: 'home' },
  ...PROJECTS.map((p): ISection => ({
    id: p.id, label: p.title, en: p.name, type: 'project', projectId: p.id,
  })),
  { id: 'other', label: '更多', en: 'OTHER', type: 'other' },
  { id: 'about', label: '关于', en: 'ABOUT', type: 'about' },
];
