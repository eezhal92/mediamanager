<?php

use Illuminate\Database\Seeder;
use App\Media;

class MediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Media::truncate();

        $medias = [
          [
            'filename'=> 'foo.jpg',
            'path'=> 'img/medias/foo.jpg',
            'mime_type'=> 'jpeg',
            'size'=> 20000,
          ],
          [
            'filename'=> 'bar.jpg',
            'path'=> 'img/medias/bar.jpg',
            'mime_type'=> 'jpeg',
            'size'=> 26000,
          ],
          [
            'filename'=> 'lorem.jpg',
            'path'=> 'img/medias/lorem.jpg',
            'mime_type'=> 'jpeg',
            'size'=> 27000,
          ],
          [
            'filename'=> 'ipsum.jpg',
            'path'=> 'img/medias/ipsum.jpg',
            'mime_type'=> 'image/jpeg',
            'size'=> 29000,
          ]
        ];

        foreach($medias as $media)
        {
          Media::create($media);
        }
    }
}
