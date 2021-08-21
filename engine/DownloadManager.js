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
      await this.dequeueJob().start();
    }
  },
};

module.exports = DownloadManager;
