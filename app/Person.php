<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Person extends Model {
	protected $fillable = ['name', 'age', 'gender', 'address'];

	public function getGenderAttribute($value)
	{
		return ($value == 'f') ? 'Female' : 'Male';
	}
}
