export interface AnimationAsset {
  id: string;
  title: string;
  type: 'Sticker' | 'GIF' | 'Emoji';
  src: string;
}

export const animations: AnimationAsset[] = [
  // Stickers
  { id: 'sticker-1', title: 'Cool Cat', type: 'Sticker', src: 'https://placehold.co/400x400.png?text=Cool+Cat' },
  { id: 'sticker-2', title: 'Happy Robot', type: 'Sticker', src: 'https://placehold.co/400x400.png?text=Happy+Robot' },
  { id: 'sticker-3', title: 'Pizza Love', type: 'Sticker', src: 'https://placehold.co/400x400.png?text=Pizza+Love' },
  { id: 'sticker-4', title: 'Gaming Time', type: 'Sticker', src: 'https://placehold.co/400x400.png?text=Gaming+Time' },
  { id: 'sticker-5', title: 'Morning Coffee', type: 'Sticker', src: 'https://placehold.co/400x400.png?text=Morning+Coffee' },
  { id: 'sticker-6', title: 'Working Hard', type: 'Sticker', src: 'https://placehold.co/400x400.png?text=Working+Hard' },
  { id: 'sticker-7', title: 'On My Way', type: 'Sticker', src: 'https://placehold.co/400x400.png?text=On+My+Way' },
  { id: 'sticker-8', title: 'Good Night', type: 'Sticker', src: 'https://placehold.co/400x400.png?text=Good+Night' },

  // GIFs
  { id: 'gif-1', title: 'Dancing Banana', type: 'GIF', src: 'https://media.tenor.com/d5b_s6A0y0UAAAAC/banana-dance.gif' },
  { id: 'gif-2', title: 'Funny Cat', type: 'GIF', src: 'https://media.tenor.com/2652v1a_30IAAAAC/cat-driving-serious.gif' },
  { id: 'gif-3', title: 'Thumbs Up', type: 'GIF', src: 'https://media.tenor.com/M1oB3-2GPdEAAAAC/thumbs-up-the-terminator.gif' },
  { id: 'gif-4', title: 'Mind Blown', type: 'GIF', src: 'https://media.tenor.com/T0i_p2pA4VMAAAAC/mind-blown-woah.gif' },
  { id: 'gif-5', title: 'Deal With It', type: 'GIF', src: 'https://media.tenor.com/hYvj2_W534MAAAAC/deal-with-it.gif' },
  { id: 'gif-6', title: 'Facepalm', type: 'GIF', src: 'https://media.tenor.com/1-mI8yLso2QAAAAC/facepalm-picard.gif' },
  { id: 'gif-7', title: 'Slow Clap', type: 'GIF', src: 'https://media.tenor.com/y_1j5sV_2-AAAAAC/orson-welles-clapping.gif' },
  { id: 'gif-8', title: 'Eye Roll', type: 'GIF', src: 'https://media.tenor.com/e2r_W_w-z-sAAAAC/eye-roll-whatever.gif' },

  // Emojis
  { id: 'emoji-1', title: 'Smiling Face with Sunglasses', type: 'Emoji', src: 'https://placehold.co/400x400.png?text=😎' },
  { id: 'emoji-2', title: 'Rocket', type: 'Emoji', src: 'https://placehold.co/400x400.png?text=🚀' },
  { id: 'emoji-3', title: 'Clapping Hands', type: 'Emoji', src: 'https://placehold.co/400x400.png?text=👏' },
  { id: 'emoji-4', title: 'Fire', type: 'Emoji', src: 'https://placehold.co/400x400.png?text=🔥' },
  { id: 'emoji-5', title: 'Thinking Face', type: 'Emoji', src: 'https://placehold.co/400x400.png?text=🤔' },
  { id: 'emoji-6', title: 'Party Popper', type: 'Emoji', src: 'https://placehold.co/400x400.png?text=🎉' },
  { id: 'emoji-7', title: 'Ghost', type: 'Emoji', src: 'https://placehold.co/400x400.png?text=👻' },
  { id: 'emoji-8', title: 'Hundred Points', type: 'Emoji', src: 'https://placehold.co/400x400.png?text=💯' },
];