<div class="container">
  <div class="buttons">
    <button class="save-btn">Save changes</button>
    <button class="save-preview-btn">Save + Preview</button>
    <button class="cancel-btn">Cancel</button>
  </div>

  <h3 class="section-title">Tagline & Bio</h3>

  <div class="profile-section">
    <h4 class="profile-title">Public profile</h4>
    <h4 class="profile-title">Awards</h4>
    <h4 class="profile-title">Links</h4>
  </div>

  <div class="form-section">
    <label for="language">Language</label>
    <div class="language-selector">
      <span class="language">EN</span> <span>(Default)</span>
    </div>

    <label for="tagline">Tagline</label>
    <input
      type="text"
      id="tagline"
      placeholder="Your company, position, title - or everything combined."
    />

    <label for="biography">Biography</label>
    <textarea id="biography" placeholder="Enter your biography"></textarea>

    <div class="public-profile-check">
      <input type="checkbox" id="show-profile" checked />
      <label for="show-profile">Show in public profile</label>
    </div>

    <div class="alert">
      <p>
        These are your default tagline and bio, and changing them does not
        update already submitted sessions.
      </p>
    </div>

    <button class="add-language-btn">+ Add Language</button>
  </div>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    padding: 20px;
  }

  .container {
    background-color: white;
    padding: 20px;
    max-width: 600px;
    margin: auto;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .buttons {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    margin-bottom: 20px;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }

  .save-btn {
    background-color: #66c2a3;
    color: white;
  }

  .save-preview-btn {
    background-color: #5aaf8b;
    color: white;
  }

  .cancel-btn {
    background-color: #c4c4c4;
    color: black;
  }

  .section-title {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .profile-section {
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    margin-bottom: 20px;
  }

  .profile-title {
    font-weight: bold;
    color: #666;
    font-size: 14px;
  }

  .form-section {
    margin-top: 20px;
  }

  label {
    font-size: 14px;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  .language-selector {
    display: inline-block;
    margin-bottom: 20px;
    background-color: #e0e0e0;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .language {
    font-weight: bold;
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }

  textarea {
    height: 100px;
  }

  .public-profile-check {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .public-profile-check label {
    margin-left: 5px;
    font-size: 14px;
  }

  .alert {
    background-color: #fff3cd;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    font-size: 12px;
    color: #856404;
  }

  .add-language-btn {
    background-color: white;
    color: #007bff;
    border: 1px solid #007bff;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
  }

  .add-language-btn:hover {
    background-color: #007bff;
    color: white;
  }
</style>
