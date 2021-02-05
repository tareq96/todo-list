import React, { useEffect, useState } from 'react';
import { noteServices } from './services';
import { spinnerService } from './spinnerService';

const Notes = () => {

    const [notes, setNotes] = useState([]);
    const [isReady, setIsReady] = useState(false);

    const init = () => {
        const $ = window.jQuery;
        const formatDate = (date) => {
            return (
                date.getDate() +
                "/" +
                (date.getMonth() + 1) +
                "/" +
                date.getFullYear()
            );
        }

        $('[data-toggle="tooltip"]').tooltip();

        let currentDate = formatDate(new Date());

        $(".due-date-button").datepicker({
            format: "dd/mm/yyyy",
            autoclose: true,
            todayHighlight: true,
            startDate: currentDate,
            orientation: "bottom right"
        });

        $(".due-date-button").on("click", function (event) {
            $(".due-date-button")
                .datepicker("show")
                .on("changeDate", function (dateChangeEvent) {
                    $(".due-date-button").datepicker("hide");
                    $(".due-date-label").text(formatDate(dateChangeEvent.date));
                });
        });
    }

    useEffect(() => {
        (function () {
            var timeer = setInterval(function () {
                if (typeof window.jQuery === 'undefined') {
                    return;
                }
                clearInterval(timeer);
                init();
                getNotes();
            }, 500);
        })();
    }, []);

    const preparNotes = (notes) => {
        setIsReady(true);
        notes && notes.length > 0 && notes.forEach(note => {
            note.isReadOnly = true;
            if (note.duo_date) {
                note.duo_date = note.duo_date.split("-").reverse().join("-");
            }
            if (note.created_at) {
                let date = note.created_at.split(" ")[0];
                note.created_at = date.split("-").reverse().join("-");
            }
        });

        setNotes(notes);
    }

    const getNotes = async () => {
        spinnerService.showSpinner();
        const notes = await noteServices.getNotes();
        preparNotes(notes);
    }

    const Input = ({ note }) => {
        const [value, setValue] = useState(note.title);

        const input = <input value={value}
            title={value}
            id={`note_${note.id}`}
            type="text"
            readOnly={note.isReadOnly}
            onChange={e => setValue(e.target.value)}
            className={(note.status === 'Complete' || note.isReadOnly ? 'bg-transparent' : '') + " form-control form-control-lg border-0 edit-todo-input rounded"} />;
        return input;
    }

    const clearForm = () => {
        document.getElementById('note-title').value = "";
        document.getElementById('due_date').innerText = "";
    }

    const addNote = async (e) => {
        spinnerService.showSpinner();
        e.preventDefault();
        let note = {};

        note.title = document.getElementById('note-title').value;
        note.status = 'Active';

        let duo_date = document.getElementById('due_date').innerText;
        duo_date = duo_date.split("/").reverse().join("-");

        note.duo_date = duo_date;

        const data = await noteServices.addNote(note);
        preparNotes(data);
        clearForm();
    }

    const editNote = async (note, index) => {
        const newTitle = document.getElementById(`note_${note.id}`).value;

        if (!notes[index].isReadOnly) {
            spinnerService.showSpinner();
            note.title = newTitle;
            if (note.duo_date) {
                note.duo_date = note.duo_date.split("-").reverse().join("-");
            }
            const result = await noteServices.editNote(note, note.id);
            preparNotes(result);
        } else {
            let newNotes = [...notes];
            newNotes[index].isReadOnly = !newNotes[index].isReadOnly;
            await setNotes(newNotes);
        }
    }

    const deleteNote = async (id) => {
        spinnerService.showSpinner();
        const result = await noteServices.deleteNote(id);
        preparNotes(result);
    }

    const editNoteStatus = async (note, id) => {
        spinnerService.showSpinner();
        if (note.status === 'Complete') {
            note.status = 'Active';
        } else if (note.status === 'Active') {
            note.status = 'Complete';
        }

        note.duo_date = note.duo_date ? note.duo_date.split("-").reverse().join("-") : note.duo_date;
        const result = await noteServices.editNote(note, id);
        preparNotes(result);
    }

    const changeFilter = async (filter) => {
        spinnerService.showSpinner();
        const result = await noteServices.changeFilter(filter);
        preparNotes(result);
    }

    return (
        <div className="App">
            <div className="container m-5 p-2 rounded mx-auto bg-light shadow">
                {/* <!-- App title section --> */}
                <div className="row m-1 p-4">
                    <div className="col">
                        <div className="title p-1 h2 text-primary text-center mx-auto display-inline-block">
                            <i className="fa fa-check bg-primary text-white rounded p-2"></i>
                            <u className="ml-3">My Todo List</u>
                        </div>
                    </div>
                </div>
                {/* <!-- Create todo section --> */}
                <div className="row m-1 p-3">
                    <div className="col col-11 mx-auto">
                        <form onSubmit={(e) => { addNote(e) }}>
                            <div className="row bg-white rounded shadow-sm p-2 add-todo-wrapper align-items-center justify-content-center">
                                <div className="col">
                                    <input required id="note-title" className="form-control form-control-lg border-0 add-todo-input bg-transparent rounded" type="text" placeholder="Add new .." />
                                </div>
                                <div className="col-auto m-0 px-2 d-flex align-items-center">
                                    <label id="due_date" className="text-secondary my-2 p-0 px-1 view-opt-label due-date-label"></label>
                                    <i className="fa fa-calendar my-2 px-1 text-primary btn due-date-button" data-toggle="tooltip" data-placement="bottom" title="Set a Due date"></i>
                                    <i className="fa fa-calendar-times-o my-2 px-1 text-danger btn clear-due-date-button d-none" data-toggle="tooltip" data-placement="bottom" title="Clear Due date"></i>
                                </div>
                                <div className="col-auto px-0 mx-0 mr-2">
                                    <button type="submit" className="btn btn-primary">Add</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="p-2 mx-4 border-black-25 border-bottom"></div>
                {/* <!-- View options section --> */}
                <div className="row m-1 p-3 px-5">
                    <div className="col-auto d-flex align-items-center">
                        <label className="text-secondary my-2 pr-2 view-opt-label">Filter</label>
                        <select onChange={(e) => { changeFilter(e.target.value) }} className="custom-select custom-select-sm btn my-2">
                            <option value="all" defaultValue>All</option>
                            <option value="Completed">Completed</option>
                            <option value="Active">Active</option>
                            <option value="has-due-date">Has due date</option>
                        </select>
                    </div>
                    {/* <div className="col-auto d-flex align-items-center px-1 pr-3">
                        <label className="text-secondary my-2 pr-2 view-opt-label">Sort</label>
                        <select className="custom-select custom-select-sm btn my-2">
                            <option value="added-date-asc" defaultValue>Added date</option>
                            <option value="due-date-desc">Due date</option>
                        </select>
                        <i className="fa fa fa-sort-amount-asc text-info btn mx-0 px-0 pl-1" data-toggle="tooltip" data-placement="bottom" title="Ascending"></i>
                        <i className="fa fa fa-sort-amount-desc text-info btn mx-0 px-0 pl-1 d-none" data-toggle="tooltip" data-placement="bottom" title="Descending"></i>
                    </div> */}
                </div>
                {/* <!-- Todo list section --> */}
                <div className="row mx-1 px-5 pb-3 w-80">
                    <div className="col mx-auto">
                        {
                            notes && notes.length > 0 && notes.map((note, index) => {
                                return (
                                    <div key={index} className="row px-3 align-items-center todo-item rounded">
                                        <div className="col-auto m-1 p-0 d-flex align-items-center">
                                            <h2 className="m-0 p-0">
                                                <i className={(note.status === 'Complete' ? 'fa fa-check-square-o' : 'fa fa-square-o') + ' text-primary btn m-0 p-0'}
                                                    data-toggle="tooltip"
                                                    data-placement="bottom"
                                                    title={note.status === 'Complete' ? 'Mark as todo' : 'Mark as complete'}
                                                    onClick={() => { editNoteStatus(note, note.id) }}></i>
                                            </h2>
                                        </div>
                                        <div className="col px-1 m-1 d-flex align-items-center">
                                            <Input note={note}></Input>
                                        </div>
                                        {
                                            note.duo_date &&
                                            <div className="col-auto m-1 p-0 px-3">
                                                <div className="row">
                                                    <div className="col-auto d-flex align-items-center rounded bg-white border border-warning">
                                                        <i className="fa fa-hourglass-2 my-2 px-2 text-warning btn" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Due on date"></i>
                                                        <h6 className="text my-2 pr-2">{note.duo_date}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <div className="col-auto m-1 p-0 todo-actions">
                                            <div className="row d-flex align-items-center justify-content-end">
                                                <h5 className="m-0 p-0 px-2">
                                                    <i className={(note.isReadOnly ? "fa fa-pencil" : "fa fa-check") + (note.status === 'Complete' ? ' disabled' : ' ') + " text-info btn m-0 p-0"} data-toggle="tooltip" data-placement="bottom" title="Edit todo" onClick={() => { editNote(note, index) }}></i>
                                                </h5>
                                                <h5 className="m-0 p-0 px-2">
                                                    <i className="fa fa-trash-o text-danger btn m-0 p-0" data-toggle="tooltip" data-placement="bottom" title="Delete todo" onClick={() => { deleteNote(note.id) }}></i>
                                                </h5>
                                            </div>
                                            <div className="row todo-created-info">
                                                <div className="col-auto d-flex align-items-center pr-2">
                                                    <i className="fa fa-info-circle my-2 px-2 text-black-50 btn" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Created date"></i>
                                                    <label className="date-label my-2 text-black-50">{note.created_at}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        {
                            isReady && notes && notes.length === 0 &&
                            (
                                <div className="mt-5 mb-3">
                                    <h2 className="text-primary title">Your todo list is empty</h2>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notes;
