import { initialize_database } from "../memory/chat_memory.js";
import { createDirectories } from "./directories.js";
import { initializeModels } from "./model.js";
import { saveSetUp } from "./state.js";
import ora from "ora";

export const initializeNavix = async () => {
    console.log(
        "\n[SETUP] Initializing Navix...\n"
    );

    const dirSpinner =
        ora(
            "Creating directories..."
        ).start();

    await createDirectories();

    dirSpinner.succeed(
        "Directories created"
    );


    const modelSpinner =
        ora(
            "Downloading embedding model..."
        ).start();

    try {

        await initializeModels();

        modelSpinner.succeed(
            "Embedding model ready"
        );

    } catch (error) {

        modelSpinner.fail(
            "Model download failed"
        );

        throw error;
    }

    const DbSpinner = ora(
        "Initializing database setup"
    ).start();

    await initialize_database();

    DbSpinner.succeed(
        "database setup completed."
    )


    await saveSetUp({
        initialized: true,
        version: "0.0.1"
    });

    console.log(
        "\n[READY] Navix initialized\n"
    );
}