<?php namespace App\Handlers\Events;

use App\Events\MediaIsGoingToBeStored;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

class UploadAndManipulateFile {

	/**
	 * Create the event handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Handle the event.
	 *
	 * @param  MediaIsGoingToBeStored  $event
	 * @return void
	 */
	public function handle(MediaIsGoingToBeStored $event)
	{
		dd('handled');
	}

}
