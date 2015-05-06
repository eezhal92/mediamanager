<?php namespace App\Events;

use App\Events\Event;

use Illuminate\Queue\SerializesModels;

class MediaIsGoingToBeStored extends Event {

	use SerializesModels;

	public 	
	/**
	 * Create a new event instance.
	 *
	 * @return void
	 */
	public function __construct(Media $media)
	{
		dd($media);
	}

}
