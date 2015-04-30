<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Media extends Model {

	protected $fillable = ['filename', 'path', 'mime_type', 'size'];

	public $timestamps = true;

    public $appends = ['extension', 'formatted_size', 'file_path'];

}
