<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function() {
	return redirect('medias');
});

Route::get('home', 'HomeController@index');

Route::get('admissions', [
	'as'   => 'admissions.index',
	'uses' => 'AdmissionsController@index'
]);

Route::get('admissions/apply', [
	'as'   => 'admissions.create',
	'uses' => 'AdmissionsController@create'
]);

Route::post('admissions', [
	'as'   => 'admissions.store',
	'uses' => 'AdmissionsController@store'
]);

Route::get('admissions/applicants', [
	'as'   => 'admissions.show',
	'uses' => 'AdmissionsController@applicantLists'
]);

Route::resource('medias', 'MediasController');

Route::get('media-explorer', function() {
	return View::make('media-explorer');
});

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);
