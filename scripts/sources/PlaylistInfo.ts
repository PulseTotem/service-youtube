/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/libsdef/node-uuid.d.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/server/SourceItf.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/RestClient.ts" />

/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoURL.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoType.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/Picture.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/PictureURL.ts" />

/// <reference path="../YoutubeNamespaceManager.ts" />

var moment : any = require('moment');

/**
 * Represents the PlaylistInfo Youtube's Source.
 *
 * @class PlaylistInfo
 * @extends SourceItf
 */
class PlaylistInfo extends SourceItf {

	/**
	 * Constructor.
	 *
	 * @param {Object} params - Source's params.
	 * @param {YoutubeNamespaceManager} youtubeNamespaceManager - NamespaceManager attached to Source.
	 */
	constructor(params : any, youtubeNamespaceManager : YoutubeNamespaceManager) {
		super(params, youtubeNamespaceManager);

		if (this.checkParams(["oauthKey", "YoutubePlaylistId", "InfoDuration", "Limit"])) {
			this.run();
		}
	}

	public run() {
		var self = this;

		var fail = function(error) {
			if(error) {
				Logger.error(error);
			}
		};

		var successRetrieveInfo = function(result1) {
			var info = result1.data();

			if(info.items.length > 0) {

				var playlistInfos = info.items[0];

				var videoPlaylist : VideoPlaylist = new VideoPlaylist();
				videoPlaylist.setId(playlistInfos.id);
				var creationDate : any = moment(playlistInfos.snippet.publishedAt);
				videoPlaylist.setCreationDate(creationDate.toDate());

				var nbItems = parseInt(self.getParams().Limit);

				videoPlaylist.setDurationToDisplay(nbItems*parseInt(self.getParams().InfoDuration));

				// Manage title and description
				videoPlaylist.setTitle(playlistInfos.snippet.title);
				videoPlaylist.setDescription(playlistInfos.snippet.description);


				// Manage thumbnail
				var thumbnail : Picture = new Picture();
				thumbnail.setTitle(playlistInfos.snippet.title);
				thumbnail.setDescription(playlistInfos.snippet.description);


				if(typeof(playlistInfos.snippet.thumbnails.default) != "undefined") {
					var thumbnailThumbInfos = playlistInfos.snippet.thumbnails.default;
					var thumbnailThumb:PictureURL = new PictureURL();
					thumbnailThumb.setURL(thumbnailThumbInfos.url);
					thumbnailThumb.setWidth(thumbnailThumbInfos.width);
					thumbnailThumb.setHeight(thumbnailThumbInfos.height);
					thumbnail.setThumb(thumbnailThumb);
				}

				if(typeof(playlistInfos.snippet.thumbnails.medium) != "undefined") {
					var thumbnailSmallInfos = playlistInfos.snippet.thumbnails.medium;
					var thumbnailSmall:PictureURL = new PictureURL();
					thumbnailSmall.setURL(thumbnailSmallInfos.url);
					thumbnailSmall.setWidth(thumbnailSmallInfos.width);
					thumbnailSmall.setHeight(thumbnailSmallInfos.height);
					thumbnail.setSmall(thumbnailSmall);
				}

				if(typeof(playlistInfos.snippet.thumbnails.high) != "undefined") {
					var thumbnailMediumInfos = playlistInfos.snippet.thumbnails.high;
					var thumbnailMedium:PictureURL = new PictureURL();
					thumbnailMedium.setURL(thumbnailMediumInfos.url);
					thumbnailMedium.setWidth(thumbnailMediumInfos.width);
					thumbnailMedium.setHeight(thumbnailMediumInfos.height);
					thumbnail.setMedium(thumbnailMedium);
				}

				if(typeof(playlistInfos.snippet.thumbnails.standard) != "undefined") {
					var thumbnailLargeInfos = playlistInfos.snippet.thumbnails.standard;
					var thumbnailLarge:PictureURL = new PictureURL();
					thumbnailLarge.setURL(thumbnailLargeInfos.url);
					thumbnailLarge.setWidth(thumbnailLargeInfos.width);
					thumbnailLarge.setHeight(thumbnailLargeInfos.height);
					thumbnail.setLarge(thumbnailLarge);
				}

				if(typeof(playlistInfos.snippet.thumbnails.maxres) != "undefined") {
					var thumbnailOriginalInfos = playlistInfos.snippet.thumbnails.maxres;
					var thumbnailOriginal:PictureURL = new PictureURL();
					thumbnailOriginal.setURL(thumbnailOriginalInfos.url);
					thumbnailOriginal.setWidth(thumbnailOriginalInfos.width);
					thumbnailOriginal.setHeight(thumbnailOriginalInfos.height);
					thumbnail.setOriginal(thumbnailOriginal);
				}

				videoPlaylist.setThumbnail(thumbnail);

				var successSearch = function (result2) {
					var data = result2.data();

					var videoIdsList = [];

					data.items.forEach(function(item : any) {
						videoIdsList.push(item.contentDetails.videoId);
					});

					var videoIdsListString = videoIdsList.join();

					var successDetails = function(result3) {
						var details = result3.data();

						var totalPlaylistDurationInSeconds = 0;

						details.items.forEach(function(item : any) {

							var video : VideoURL = new VideoURL();
							video.setId(item.id);
							var videoCreationDate : any = moment(item.snippet.publishedAt);
							video.setCreationDate(videoCreationDate.toDate());
							var videoDuration : any = moment.duration(item.contentDetails.duration);
							var videoDurationInSeconds = videoDuration.asSeconds();
							video.setDurationToDisplay(videoDurationInSeconds);
							totalPlaylistDurationInSeconds += videoDurationInSeconds;

							// Manage title, description, url and VideoType
							video.setTitle(item.snippet.title);
							video.setDescription(item.snippet.description);
							video.setURL("https://www.youtube.com/embed/" + item.id + "?autoplay=1&controls=0&modestbranding=1");
							video.setType(VideoType.YOUTUBE);

							// Manage thumbnail
							var thumbnailVideo : Picture = new Picture();
							thumbnailVideo.setTitle(item.snippet.title);
							thumbnailVideo.setDescription(item.snippet.description);

							if(typeof(item.snippet.thumbnails.default) != "undefined") {
								var thumbnailVideoThumbInfos = item.snippet.thumbnails.default;
								var thumbnailVideoThumb:PictureURL = new PictureURL();
								thumbnailVideoThumb.setURL(thumbnailVideoThumbInfos.url);
								thumbnailVideoThumb.setWidth(thumbnailVideoThumbInfos.width);
								thumbnailVideoThumb.setHeight(thumbnailVideoThumbInfos.height);
								thumbnailVideo.setThumb(thumbnailVideoThumb);
							}

							if(typeof(item.snippet.thumbnails.medium) != "undefined") {
								var thumbnailVideoSmallInfos = item.snippet.thumbnails.medium;
								var thumbnailVideoSmall:PictureURL = new PictureURL();
								thumbnailVideoSmall.setURL(thumbnailVideoSmallInfos.url);
								thumbnailVideoSmall.setWidth(thumbnailVideoSmallInfos.width);
								thumbnailVideoSmall.setHeight(thumbnailVideoSmallInfos.height);
								thumbnailVideo.setSmall(thumbnailVideoSmall);
							}

							if(typeof(item.snippet.thumbnails.high) != "undefined") {
								var thumbnailVideoMediumInfos = item.snippet.thumbnails.high;
								var thumbnailVideoMedium:PictureURL = new PictureURL();
								thumbnailVideoMedium.setURL(thumbnailVideoMediumInfos.url);
								thumbnailVideoMedium.setWidth(thumbnailVideoMediumInfos.width);
								thumbnailVideoMedium.setHeight(thumbnailVideoMediumInfos.height);
								thumbnailVideo.setMedium(thumbnailVideoMedium);
							}

							if(typeof(item.snippet.thumbnails.standard) != "undefined") {
								var thumbnailVideoLargeInfos = item.snippet.thumbnails.standard;
								var thumbnailVideoLarge:PictureURL = new PictureURL();
								thumbnailVideoLarge.setURL(thumbnailVideoLargeInfos.url);
								thumbnailVideoLarge.setWidth(thumbnailVideoLargeInfos.width);
								thumbnailVideoLarge.setHeight(thumbnailVideoLargeInfos.height);
								thumbnailVideo.setLarge(thumbnailVideoLarge);
							}

							if(typeof(item.snippet.thumbnails.maxres) != "undefined") {
								var thumbnailVideoOriginalInfos = item.snippet.thumbnails.maxres;
								var thumbnailVideoOriginal:PictureURL = new PictureURL();
								thumbnailVideoOriginal.setURL(thumbnailVideoOriginalInfos.url);
								thumbnailVideoOriginal.setWidth(thumbnailVideoOriginalInfos.width);
								thumbnailVideoOriginal.setHeight(thumbnailVideoOriginalInfos.height);
								thumbnailVideo.setOriginal(thumbnailVideoOriginal);
							}

							video.setThumbnail(thumbnailVideo);

							videoPlaylist.addVideo(video);
						});

						videoPlaylist.setDurationToDisplay(totalPlaylistDurationInSeconds);

						self.getSourceNamespaceManager().sendNewInfoToClient(videoPlaylist);
					};

					var videosDetailsUrl = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=' + videoIdsListString + '&maxResults=' + nbItems +'&key=' + Youtube.youtubeAPIKey;

					RestClient.get(videosDetailsUrl, successDetails, fail);
				};

				var playlistContentUrl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=' + self.getParams().YoutubePlaylistId + '&maxResults=' + nbItems +'&key=' + Youtube.youtubeAPIKey;

				RestClient.get(playlistContentUrl, successSearch, fail);
			} else {
				fail(new Error("Playlist not found..."));
			}
		};

		var retrieveInfoUrl = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=' + self.getParams().YoutubePlaylistId + '&key=' + Youtube.youtubeAPIKey;

		RestClient.get(retrieveInfoUrl, successRetrieveInfo, fail);
	}
}