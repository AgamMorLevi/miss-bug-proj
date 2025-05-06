export function AppFooter () {
    const year = (new Date).getFullYear()

    return <footer className="main-content flex center">
        <p>coffeerights &copy; {year}</p>
    </footer>
}