<?php namespace App\Http\Requests;

use App\Http\Requests\Request;

class StoreAdmissionsRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			'name'    => 'required|min:3',
			'age'     => 'required|numeric',
			'gender'  => 'required',
			'address' => 'required|min:8'
		];
	}

}
