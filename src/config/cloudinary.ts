import { Cloudinary } from '@cloudinary/url-gen';

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'demo'
  },
  url: {
    secure: true
  }
});