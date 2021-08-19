const DownloadManager = {
  queue: [],

  enqueueJob(downloadJob) {
    console.log("DownloadManager: enqueueJob");
    this.queue.push(downloadJob);
    if (this.queue.length === 1) {
      // Start if queue was previously empty
      this.download();
    }
  },

  dequeueJob() {
    console.log("DownloadManager: dequeueJob");
    return this.queue.shift();
  },

  async download() {
    while (this.queue.length > 0) {
      // Automatically continue to next job in queue
      console.log("DownloadManager: download");
      await this.dequeueJob().start();
    }
  },
};

module.exports = DownloadManager;
