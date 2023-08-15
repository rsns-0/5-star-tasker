## Branching/Commit/PR Flow:

Github cheatsheet: https://education.github.com/git-cheat-sheet-education.pdf

1. Create a new branch with the name of the feature you are working on.
2. If you are waiting for a feature from another branch to finish for testing, stash your current changes, then switch over and help finish that other feature.
3. Keep feature branches small. For example, for the translation feature, break that into two branches: one for delivering the translation to the discord bot service, and one for obtaining the translation from the deepL API.
4. After your feature is fully complete, send a pull request to its parent branch.
5. Don't work in master directly unless it's a small bug fix.