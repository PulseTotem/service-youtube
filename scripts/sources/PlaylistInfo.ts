/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-backend/libsdef/node-uuid.d.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="../../t6s-core/core-backend/scripts/server/SourceItf.ts" />

/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoPlaylist.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoURL.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/VideoType.ts" />

/// <reference path="../YoutubeNamespaceManager.ts" />

var uuid : any = require('node-uuid');

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

		var success = function(oauthActions) {
			/*parseInt(self.getParams().Limit)
			.setDurationToDisplay(parseInt(self.getParams().InfoDuration)
			uuid.v1()
			self.getSourceNamespaceManager().sendNewInfoToClient(tweetList);*/

			var successSearch = function(result) {
				Logger.debug(result);
			};

			Logger.info("youtubeOAuth OK ! => oauthActions")
			Logger.debug(oauthActions);

			var searchUrl = '/v3/playlistItems?part=snippet,contentDetails,id,status&playlistId=' + self.getParams().YoutubePlaylistId + '&maxResults=20';

			Logger.info("searchUrl => " + searchUrl);

			oauthActions.get(searchUrl, successSearch, fail);
		};

		self.getSourceNamespaceManager().manageOAuth('youtube', self.getParams().oauthKey, success, fail);
	}
}