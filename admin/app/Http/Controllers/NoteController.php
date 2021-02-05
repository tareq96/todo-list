<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Note;
use App\Http\Resources\Note as NoteResource;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Note::orderBy('created_at', 'desc')->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|max:255',
            'status' => 'required',
        ]);

        $note = new Note();
        $note->title = $request->title;
        $note->status = $request->status;
        $note->duo_date = $request->duo_date;
        $note->save();

        return Note::orderBy('created_at', 'desc')->get();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return new NoteResource(Note::findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|max:255',
            'status' => 'required',
        ]);

        $note = Note::find($id);
        $note->title = $request->title;
        $note->status = $request->status;
        $note->duo_date = $request->duo_date;
        $note->save();

        return Note::orderBy('created_at', 'desc')->get();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $note = Note::find($id);
        $note->delete();
        return Note::orderBy('created_at', 'desc')->get();
    }

    public function changeFilter($filterName) {
        if ($filterName === 'all')
        {
            return Note::orderBy('created_at', 'desc')->get();
        }

        else if($filterName === 'Completed')
        {
            return Note::where('status', 'complete')->orderBy('created_at', 'desc')->get();
        }

        else if($filterName === 'has-due-date') {
            return Note::whereNotNull('duo_date')->orderBy('created_at', 'desc')->get();
        }
        
        $notes = Note::where('status', $filterName)->orderBy('created_at', 'desc')->get();
        return $notes;
    }
}
