(function(){
    var app = angular.module("DailyMotionApp");
    app.controller("DailyMotionCtrl", DailyMotionCtrl);

    function DailyMotionCtrl(DailyMotionSvc) {
        var self = this;
        self.isPaginationVisible = false;
        self.hasPreviousPage = false;
        self.hasNextPage = false;
        self.searchMode = "";

        this.paginateVideos = function() {
            if (self.videos) {
                var videoPages = Math.ceil(self.videos.total/self.videos.limit);
                self.paginationInfo = {
                    currentPage : self.videos.page,
                    limit : self.videos.limit,
                    totalResults : self.videos.total,
                    totalPages : videoPages,
                    hasMore : self.videos.has_more,
                };
                self.createPages();
            }
        }

        this.createPages = function() {
            if (self.paginationInfo) {
                var pagesPerSection = 5;
                var section = (Math.floor(self.paginationInfo.currentPage/pagesPerSection));
                if (self.paginationInfo.currentPage % pagesPerSection == 0)
                    section = section -1;
                var startPage = (section * pagesPerSection) + 1;
                var endPage = Math.min(startPage + pagesPerSection-1, self.paginationInfo.totalPages);
                
                self.pages = [];
                for (var i=startPage; i<=endPage; i++)
                    self.pages.push(i);

                if (self.pages.length > 1)
                    self.isPaginationVisible = true;
                self.hasPreviousPage = (startPage == 1) ? false:true;
                self.hasNextPage = (endPage < self.paginationInfo.totalPages) ? true:false;
            }
        }

        this.resetPagination = function() {
            self.isPaginationVisible = false;
            self.hasPreviousPage = false;
            self.hasNextPage = false;
        }

        this.retrievePage = function(page) {
            if ((self.searchMode == "" || self.searchMode == "keyword") && (self.searchVideoKeyword)) {
                self.resetPagination();
                
                DailyMotionSvc.searchVideosByKeyword(self.searchVideoKeyword, page).then(
                   function(response) {
                       self.videos = response.data;
                       self.paginateVideos();
                   },
                   function() {
                       
                   }
                )
            } else if (self.searchMode == "channel" && self.channel) {
                self.resetPagination();
                
                DailyMotionSvc.searchVideosByChannel(self.channel, page).then(
                   function(response) {
                       self.videos = response.data;
                       self.paginateVideos();
                   },
                   function() {
                       
                   }
                )
            }
        }

        this.retrievePreviousPage = function() {
            if (self.pages) {
                var previousPage = self.pages[0] - 1;
                if (previousPage >= 1)
                    self.retrievePage(previousPage);
            }
        }

        this.retrieveNextPage = function() {
            if (self.pages && self.paginationInfo) {
                var nextPage = self.pages[self.pages.length-1] + 1;
                if (nextPage <= self.paginationInfo.totalPages) {
                    self.retrievePage(nextPage);
                }
            }
        }

        this.searchVideosByKeyword = function() {
            self.searchMode = "keyword";
            self.retrievePage(1);
        }

        this.searchVideosByChannel = function(channel) {
            self.searchMode = "channel";
            self.channel = channel;
            self.retrievePage(1);
        }
    }
})();
