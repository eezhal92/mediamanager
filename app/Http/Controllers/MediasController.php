<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Media;
use App\Http\Requests\StoreMediaRequest;

use Illuminate\Http\Request;

class MediasController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request)
	{
		if($request->ajax())
		{
			$page 		= e($request->get('page','1'));
        $perPage 	= e($request->get('per_page','10'));
        $offset 	= $page * $perPage - $perPage;
        $filter 	= e($request->get('filter', 'all'));
        $sort 		= e($request->get('sort'));


        switch ($filter) {
          case 'files':
          case 'images':
          default:
            $media = Media::orderBy('created_at');
            break;
        }

        switch ($sort) {
            case 'date_desc':
                $media->orderBy('created_at', 'desc');
                break;
            case 'name_asc':
                $media->orderBy('nama_file', 'asc');
                break;
            case 'name_desc':
                $media->orderBy('nama_file', 'desc');
                break;
            default:
                $media->orderBy('created_at', 'asc');
                break;
        }

        return $media->take($perPage)->offset($offset)->paginate($perPage);
		}

		$medias = Media::orderBy('created_at', 'desc')->paginate(20);

		return view('medias.index', compact('medias'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('medias.create');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(StoreMediaRequest $request)
	{
//		event(new \App\Events\MediaIsGoingToBeStored());
        if( $request->hasFile('file_input') && $request->file('file_input')->isValid() )
        {
            $file = $request->file('file_input');
            $filename = $file->getClientOriginalName();

//             if($file->getMimeType() == 'application/pdf') {
// //                throw new \Exception('not supported file type');
//                 return response()->json(['error' => 'file tidak support'], 400);
//             }
            $file->move('uploads', $filename);

						$filename = $file->getClientOriginalName();
						$mime_type = $file->getClientOriginalExtension();
						$folder = 'uploads/' ;
						$path = $folder . $filename;
						$file_size = $file->getClientSize();

						$media = Media::create([
	              'filename' => $filename,
	              'mime_type' => $mime_type,
	              'path' => $path,
	              'size' => $file_size,
	          ]);

            return response()->json(['success' => 'file berhasil di upload']);
        }
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}
