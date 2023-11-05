import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
// import { nanoid } from "nanoid" //putting id for local storage
import "./style.css"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc }  from "firebase/firestore"
import { notesCollection, db } from "./firebase"


export default function App() {
    //Using local storage method
    // const [notes, setNotes] = React.useState(
    //     () => JSON.parse(localStorage.getItem("notes")) || []
    //     )
    
    //firebase method
    const [notes, setNotes] = React.useState([])

    //Using local storage method
    // const [currentNoteId, setCurrentNoteId] = React.useState(
    //     (notes[0] && notes[0].id) || ""
    // )

    //firebase method
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    //For changing the order of notes when the user clicks on the note
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)
    
    
    //Using local storage method
    // React.useEffect(() => {
    //     localStorage.setItem("notes", JSON.stringify(notes))
    // }, [notes])

    //firebase method
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            // Sync up our local notes array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])

    //firebase method
    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    //Using local storage method
    // function createNewNote() {
    //     const newNote = {
    //         id: nanoid(),
    //         body: "# Type your markdown note's title here"
    //     }
    //     setNotes(prevNotes => [newNote, ...prevNotes])
    //     setCurrentNoteId(newNote.id)
    // }

    //firebase method
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    
    //Using local storage method
    // function updateNote(text) {
    //     // Put the most recently-modified note at the top
    //     // Create a new empty array
    //     // Loop over the original array
    //     // if the id matches
    //     // put the updated note at the 
    //     // beginning of the new array
    //     // else
    //     // push the old note to the end
    //     // of the new array
    //     // return the new array
    //     setNotes(oldNotes => {
    //         const newArray = []
    //         for(let i = 0; i < oldNotes.length; i++) {
    //             const oldNote = oldNotes[i]
    //             if(oldNote.id === currentNoteId) {
    //                 newArray.unshift({ ...oldNote, body: text })
    //             } else {
    //                 newArray.push(oldNote)
    //             }
    //         }
    //         return newArray
    //     })
    // }

    //Using firebase method
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { body: text, createdAt: Date.now(), updatedAt: Date.now() }, { merge: true })
    }

    //Using local storage method   
    // function deleteNote(event, noteId) {
    //     event.stopPropagation()
    //     setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    // }

    //firebase method
    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    } 
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={sortedNotes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />                
                <Editor 
                    currentNote={findCurrentNote()} 
                    updateNote={updateNote} 
                />
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}

