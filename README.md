# 🎓 Cognitive A11Y Prototype

## 📌 Table of Contents
1. [Description](#ℹ️-description)
2. [Tech Stack](#-tech-stack)
3. [Installation](#-installation)
4. [Project Structure](#-project-structure)
5. [Development Features](#-development-features)
6. [FAQ](#-faq)

## ℹ️ Description

This frontend prototype constitutes the practical component of my master's thesis in the **Computing in the Humanities** program at the 
Otto-Friedrich-University of Bamberg. The thesis aimed to facilitate the implementation of cognitive accessibility for web developers through 
a structured guideline. This prototype applies that guideline by extending selected components of an application called [BAULA](https://github.com/uniba-mi/baula).

Some features were built with the help of GitHub Copilot (AI). Search for "Remark" to get an overview over these code snippets.

The application language is **German**. The code language is **English**.

The deployed application is available [here](https://cognitive-a11y.satishu.net/).

## 🛠 Tech Stack

- **JavaScript** (ES 6+, mostly) + **TypeScript** (special cases)
- **Svelte 5** + **Vite 7**
- **svelte-spa-router** for client-side routing
- **Svelte Material UI (SMUI)** + **Bootstrap** / **Bootstrap Icons** for user interface design
- **ESLint** for code quality

## 💾 Installation

### Requirements

- **Node.js** (`v25.2.1` or higher)
- **npm** (installed with Node.js)

### Installation steps
1. Clone the repository:
	```bash
	git clone https://github.com/ElenaLaubinger/Cognitive-A11Y-Prototype.git
	```
2. Install dependencies:
	```bash
	npm install
	npm run prepare
	```

	`npm run prepare` compiles the SMUI theme to `src/styles/smui.css` and should be run
	after the first installation and after changes to the SMUI theme.

## 📂 Project Structure

The following are the most relevant parts of the project:

```text
📂 src/
┣ 📜 app.css				# global CSS coordinator
┣ 📜 App.svelte				
┣ 📜 module_data.json		
┣ 📂 lib/
   ┣ 📂 helper_modules/			# accessibility-supporting modules					
   ┣ 📂 management/				# global states, data processing, persistence
   ┣ 📂 module_catalog/			# filters, module cards, modal dialogs
   ┣ 📂 navbar/					# navigation
   ┗ 📂 search/					# module and app-wide search
┣ 📂 routes/				# page layouts
┗ 📂 styles/				# SMUI theme + global styles
```

## 🧰 Development Features

<details>
	<summary> In-depth information on source files and features for development </summary>

### Available Scripts

- Development server 
	```bash
	npm run dev
	```

- Development server with network access

	```bash
	npm run expose
	```
	The network-accessible development server runs on port `5173`.

- Bild & Preview
  
	```bash
	npm run build
	npm run preview
	```

### Global Management

- `src/lib/management/StateManager.svelte.js` – state variables used across the application
- `src/lib/management/SharedFunctions.svelte.js` – functions used across the application

### Module Catalog

#### Data Management

- Module data is stored in `src/module_data.json`
- Data processing and flattening are handled in `src/lib/management/DataProcessor.svelte.js`.
- Visibility of basic modules is handled in `src/lib/routes/SettingsLayout.svelte`
	- Based on the chosen profile, the global state variable `profileSetting` is updated
	- This defines the active dataset by updating the following global state variables 
		- `profileModules` - stores basic modules 
		- `profileSection` - stores module sections 
		- `profileChair` - stores chairs

#### Search & Filter Functionality

- Filters are managed by `src/lib/module_catalog/module_filter/Filter.svelte.js` (functionality) and the .svelte components in `src/lib/module_catalog/module_filter/` (UI)
- Module search is handled by `src/lib/search/module_search/ModuleSearch.svelte.js` (functionality) and `src/lib/search/module_search/SearchFull.svelte` (UI)
	- Search history and suggestions include up to five terms for each search
	- Suggestions include `moduleName` and `moduleAlias` (module acronym)
- Global state variable `filteredModules` stores modules based on active search and filter terms
	- Search and filtering can be applied simultaneously; execution follows the user's input order
	- If one feature is reset, the status of the other feature (i.e., `searchActive`/`filterActive`) is checked so that only one feature is reset

### App-wide Search

- Managed by `src/lib/search/app_search/ApplicationSearch.svelte.js` (functionality) and 
`src/lib/search/app_search/SearchIcon.svelte` (UI)
- Uses shared functions of `src/lib/search/SearchShared.svelte.js`
- Possible search terms are [route names](#routing) and all `<h1>` headings
- Results are links to matching parts of the application

### Persistence

- Persistence is managed via `src/lib/management/Persistence.svelte.js`
- Data is stored in `sessionStorage` under the key `baula-session`
- Persisted data include
	- selected degree program and profile
	- visibility and confirmation status of information boxes
	- search histories for module and application searches

### Routing

Defined in `src/App.svelte`:

- `/` or `/dashboard` – Dashboard
- `/modulkatalog` – Module Catalog
- `/einstellungen` – Profile Settings
- `/links` – Quick Links
- `*` – Not Found

The application uses hash-based routing (`#/...`).
</details>

## ❓ FAQ

- **Styles are missing or appear inconsistent**   
	Run `npm run prepare` again.
- **How to reset the persisted data**   
    Use one of these options:
    - Close the browser tab
    - Close the browser window
    - Delete session storage in the browser (key: `baula-session`)
