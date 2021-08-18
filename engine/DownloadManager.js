const DownloadManager = {
  queue: [],

  enqueueJob(downloadJob) {
    console.log("DownloadManager: enqueueJob");
    this.queue.push(downloadJob);
    if (this.queue.length === 1) {
      this.download();
    }
  },

  dequeueJob() {
    console.log("DownloadManager: dequeueJob");
    return this.queue.shift();
  },

  async download() {
    while (this.queue.length > 0) {
      console.log("DownloadManager: download");
      await this.dequeueJob().start();
    }
  },
};

module.exports = DownloadManager;
