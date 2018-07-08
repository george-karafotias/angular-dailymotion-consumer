(function(){
    var app = angular.module("DailyMotionApp");
    
    app.service("DailyMotionSvc", function($http) {
        self = this;

        this.videosUrl = "https://api.dailymotion.com/videos";
        this.channelUrl = "https://api.dailymotion.com/channel/";

        this.listVideos = function() {
            return $http.get(self.videosUrl);
        }

        this.searchVideosByKeyword = function(searchVideosText, page) {
            if (page == 1)
                return $http.get(self.videosUrl + "?search=" + searchVideosText);
            else
                return $http.get(self.videosUrl + "?search=" + searchVideosText + "&page=" + page);
        }

        this.searchVideosByChannel = function(channel, page) {
            if (page == 1)
                return $http.get(self.channelUrl + channel + "/videos");
            else
                return $http.get(self.channelUrl + channel + "/videos?page=" + page);
        }
    });
})();