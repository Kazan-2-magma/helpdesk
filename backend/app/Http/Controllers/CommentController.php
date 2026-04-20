<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Comment;
use App\Models\Ticket;
use App\Http\Requests\CommentStoreRequest;
use App\Http\Resources\CommentResource;
use Exception;
use Illuminate\Support\Facades\Auth;

class CommentController extends ApiController
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(CommentStoreRequest $request)
    {
        try {
            $validated = $request->validated();

            $comment = Comment::create([
                'message' => $validated['message'],
                'ticket_id' => $request->ticket_id,
                'user_id' => Auth::id(),
            ]);

            // Handle file uploads
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $filePath = $file->store('ticket-attachments/' . $request->ticket_id, 'public');

                    Attachment::create([
                        'comment_id' => $comment->id,
                        'filename' => $file->getClientOriginalName(),
                        'file_path' => $filePath,
                        'file_size' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                    ]);
                }
            }

            $comment->load(['user', 'attachments']);

            return $this->success(new CommentResource($comment), 'Comment added successfully');
        } catch (Exception $e) {
            return $this->error('Failed to add comment', $e->getMessage());
        }
    }
}
