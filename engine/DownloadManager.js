const DownloadManager = {
  queue: [],

  enqueueJob(downloadJob) {
    console.log("DownloadManager: enqueueJob");
    this.queue.push(downloadJob);
    // Kick off download if first
    if (this.queue.length === 1) {
      this.start();
    }
  },

  dequeueJob() {
    console.log("DownloadManager: dequeueJob");
    return this.queue.shift();
  },

  async start() {
    while (this.queue.length > 0) {
      // Automatically continue to next job
      console.log("DownloadManager: download");
      await this.queue[0].start();
      this.dequeueJob();
    }
  },

  getDownloadingChapterFilenames(source, manga) {
    const chapterFilenames = this.queue
      .filter(
        (downloadJob) =>
          source.name === downloadJob.source.name &&
          manga.title === downloadJob.manga.title
      )
      .map((downloadJob) => downloadJob.chapter.filename);
    return {
      mangaFilename: manga.filename,
      chapterFilenames: chapterFilenames,
    };
  },
};

module.exports = DownloadManager;
