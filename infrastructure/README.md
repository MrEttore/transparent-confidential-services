## Cloud Deployment with Terraform

This guide explains how to deploy Transparent Service securely in the cloud using **Google Cloud confidential VMs** and Terraform. Follow these steps to run the LLM Core in a secure, hardware-based Trusted Execution Environment (TEE).

> **Note:** For an overview and local deployment instructions, see the [main README](../README.md).

### Prerequisites

-   [Terraform](https://developer.hashicorp.com/terraform/downloads) (v1.2 or newer)
-   [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (`gcloud`)
-   A Google Cloud project with billing enabled and sufficient quota for confidential VMs
-   Permissions to create Compute Engine resources

### Setup & Deployment

1. **Navigate to the infrastructure folder:**

    ```bash
    cd infrastructure
    ```

2. **Copy and edit the Terraform variables file:**

    ```bash
    cp terraform.tfvars.example terraform.tfvars
    ```

    Edit `terraform.tfvars` and set your `project_id`, `region`, and (optionally) `golden_image_project_id`.

3. **Authenticate with Google Cloud:**

    ```bash
    gcloud auth application-default login
    gcloud config set project <your-project-id>
    ```

4. **Initialize Terraform:**

    ```bash
    terraform init
    ```

5. **Review the planned changes:**

    ```bash
    terraform plan
    ```

6. **Apply the deployment:**

    ```bash
    terraform apply
    ```

    Confirm when prompted.

7. **(Optional) Destroy resources when done:**

    ```bash
    terraform destroy
    ```

### What Gets Deployed?

-   A confidential TDX-based VM running the LLM Core Docker container
-   A firewall rule to allow attestation traffic
-   All necessary network and disk resources

The deployed VM uses a golden image boot disk with Docker pre-installed and a service that, at each boot, pulls the newest image of the `llm-core`.

The VM leverages confidential computing to keep AI inference secure. The LLM Core code runs inside a TEE, ensuring that all inference and data processing remain confidential and protected from the underlying cloud provider.
