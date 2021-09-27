const { getVideoDurationInSeconds } = require('get-video-duration')
const vidoes = require('../models/videos');


const processInterval = async (req, res) => {
  let { video_link, interval_duration } = req.body;
  if (video_link && interval_duration) {
    getVideoDurationInSeconds(
      video_link
    ).then((duration) => {
      let segments = Math.floor(duration / interval_duration);
      let urlArr = [];
      let start = 0;
      let end = interval_duration;
      for (let i = 1; i <= segments; i++) {
        urlArr.push({ "video_url": `${video_link}#t=${start},${end}` });
        start = end;
        end = end + interval_duration;
      }
      //let result = urlArr.map(item => {'video_url': item});
      res.status(200).send({ interval_videos: urlArr });
    })
      .catch(err => res.status(422).send({ 'reason': 'could not process file' }))
  } else {
    res.status(500).send({ 'reason': 'Please provide video url & duration' });
  }

}

const processRanges = async (req, res) => {
  let { video_link, interval_range } = req.body;
  if (video_link && interval_range) {
    let urlArr = [];
    interval_range.forEach(element => {
      urlArr.push({ "video_url": `${video_link}#t=${element.start},${element.end}` });
    });
    res.status(200).send({ interval_videos: urlArr });

    getVideoDurationInSeconds(
      video_link
    ).then((duration) => {
      let lastRange = interval_range?.[interval_range.legth -1].end;
      if (duration<lastRange) {
        res.status(400).send({ 'reason': 'invalid interval ranges' })  
      } else {
        let urlArr = [];
        interval_range.forEach(element => {
          urlArr.push({ "video_url": `${video_link}#t=${element.start},${element.end}` });
        });
        res.status(200).send({ interval_videos: urlArr });
      }
    })
      .catch(err => res.status(422).send({ 'reason': 'could not process file' }))
  } else {
    res.status(500).send({ 'reason': 'Please provide video url & duration' });
  }

}

const processSegment = async (req, res) => {
  let { video_link, no_of_segments } = req.body;
  if (video_link && no_of_segments) {
    getVideoDurationInSeconds(
      video_link
    ).then((duration) => {
      if (no_of_segments > duration) {
        res.status(400).send({ 'reason': 'invalid number of segments' })
      } else {
        let video_duration = Math.floor(duration / no_of_segments);
        let urlArr = [];
        let start = 0;
        let end = video_duration;
        for (let i = 1; i <= no_of_segments; i++) {
          urlArr.push({ "video_url": `${video_link}#t=${start},${end}` });
          start = end;
          end = end + video_duration;
        }
        res.status(200).send({ interval_videos: urlArr });
        }
    })
      .catch(err => res.status(422).send({ 'reason': 'could not process file' }))
  } else {
    res.status(500).send({ 'reason': 'Please provide video url & duration' });
  }
}

const combineVideo = async (req, res) => {
  let { segments, width, height } = req.body;
  if (segments && segments.length) {
        let startTime = segments[0].start;
        let videoUrl = segments[0].video_url;
        let endTime = segments[segments.length - 1].end;

        res.status(200).send({ "video_url": `${videoUrl}#t=${startTime},${endTime}` });
    } else {
    res.status(500).send({ 'reason': 'Please provide segment' });
  }
}


module.exports = {
  processInterval,
  processRanges,
  processSegment,
  combineVideo
}