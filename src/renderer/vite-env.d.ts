/// <reference types="vite/client" />
import type { JarvisAPI } from '../shared/types';
declare global { interface Window { jarvis: JarvisAPI } }
export {};
