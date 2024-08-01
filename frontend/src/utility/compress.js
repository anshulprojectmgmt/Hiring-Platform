import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// Create an instance of FFmpeg
const ffmpeg = new FFmpeg({ log: true });

const loadFFmpeg = async () => {
if (!ffmpeg.loaded) {
  await ffmpeg.load();
  }
  
}

const compressVideo = async (videoBlob) => {
   
    try {
        
      await loadFFmpeg();
      
   // Convert Blobs to File objects
   const videoFile = new File([videoBlob], "video.mp4");
   

   // Load files into FFmpeg
   await ffmpeg.writeFile('video.mp4', await fetchFile(videoFile));
   
   // Compress the video
   await ffmpeg.exec(['-i', 'video.mp4', '-vcodec', 'libx264', '-crf', '30', '-preset', 'ultrafast', 'compressed_video.mp4']);
   
   // Read the compressed video file
   const compressedVideoData = await ffmpeg.readFile('compressed_video.mp4');
   
   const compressedVideoBlob = new Blob([compressedVideoData.buffer], { type: 'video/mp4' });
   

  
    return compressedVideoBlob; 
    } catch (error) {
      console.log('ffmpeg error' , error)
      return videoBlob;
    }
  };

  export default compressVideo;