export default function Video() {
  return (
    <div className="z-10 mt-12 sm:mt-16 md:mt-20 lg:mt-24 flex justify-center px-4 sm:px-6 md:px-8 w-full bg-white">
      <div className="flex justify-center items-center bg-white w-full max-w-full sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-[75vw] xl:max-w-[1300px] aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
        {/* <--add video source later--> */}
        <iframe
          allowFullScreen
          className="w-full h-full"
          title="Resilio video"
        />
      </div>
    </div>
  );
}
