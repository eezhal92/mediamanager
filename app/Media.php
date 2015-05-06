<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Media extends Model {
	protected $table = 'medias';

	protected $fillable = ['filename', 'path', 'mime_type', 'size'];

	public $timestamps = true;

    // public $appends = ['extension', 'formatted_size', 'file_path'];

    // variable for extension

    public static $images = ['jpg', 'jpeg', 'png']; 

    public static $documents = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];

    public static $archives = ['rar', 'zip'];

    // Accessor
    

    // Utility Function 

}
