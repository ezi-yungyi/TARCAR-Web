import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY as string,
  wsHost: import.meta.env.VITE_REVERB_HOST as string,
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],
});

const test = window.Echo.channel('web-server');
console.log(test);
test.listen('WebServerNotification', (e: {data: string}) => {
  console.log(e.data);
});
