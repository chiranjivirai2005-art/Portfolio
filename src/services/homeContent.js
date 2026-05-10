import { getDocument, setDocument } from './firestore.js'

export const defaultHomeContent = {
  name: 'Chiranjivi Kumar',
  department: 'Electronics and Communication Engineering',
  role: 'Hardware and embedded systems enthusiast',
  tagline: 'Building circuits, embedded prototypes, IoT systems, and clean digital experiences.',
  intro:
    'I am an ECE student focused on hardware-first problem solving: circuit design, microcontrollers, sensors, IoT workflows, and practical prototypes that connect electronics with software.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
  profileImageUrl:
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
  location: 'ECE Department',
  email: 'chiranjivirai2005@gmail.com',
  focusAreas: 'Embedded Systems, IoT, PCB Basics, Sensors, Digital Electronics, Hardware Prototyping',
  stats: 'ECE Student|Hardware Focus, 10+|Prototype Ideas, Firebase|Portfolio Backend',
  aboutTitle: 'Hardware-minded builder with a practical engineering approach',
  aboutDetails:
    'I enjoy moving from idea to working prototype: selecting components, wiring circuits, programming boards, testing sensor data, and presenting the final system clearly.',
  projectTypes: 'IoT dashboards, microcontroller projects, sensor-based systems, circuit experiments, hardware-software integrations',
  tools: 'Arduino, ESP32, Raspberry Pi, Multimeter, Breadboard, Firebase, React, Cloudinary',
}

export function parseList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function parseStats(value) {
  return String(value || '')
    .split(',')
    .map((item) => {
      const [valueText, label] = item.split('|').map((part) => part?.trim())
      return {
        value: valueText || '',
        label: label || '',
      }
    })
    .filter((item) => item.value || item.label)
}

export async function getHomeContent() {
  const content = await getDocument('siteContent', 'homepage')
  return {
    ...defaultHomeContent,
    ...content,
  }
}

export async function updateHomeContent(payload) {
  await setDocument('siteContent', 'homepage', payload)
}
