import { Component, Input } from '@angular/core';
import { Listing } from '../../listing-search/listing-search.data';

@Component({
    selector: 'app-editor',
    templateUrl: './rich-text-editor.component.html'
})

export class RTEditorComponent {
    @Input() listing: Listing = {};

    tinyMCE_API_key = 'ho6mfhwuz7956d5wu24o4k594oyp2gwgs9iqhyuf1drlcwjj';
    init = {
        height: 300,
        menubar: false,
        plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
        'undo redo | formatselect | bold italic backcolor | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | removeformat | help'
    };
}