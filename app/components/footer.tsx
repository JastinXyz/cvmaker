export default function Footer() {
    return (
        <div className="mt-4 text-xs text-center">
            <p>This project is open source and available at <a href="https://github.com/JastinXyz/cvmaker" target="_blank" className="underline">GitHub</a>.</p>
            <p>&copy; {new Date().getFullYear()} <a href="https://jstnlt.my.id" target="_blank" className="underline">jstnlt</a>.</p>
        </div>
    )
}