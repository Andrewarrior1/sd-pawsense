import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from tqdm import tqdm
import os

def main():
    # ======================
    # CONFIG
    # ======================
    DATA_DIR = "dataset/archive"
    BATCH_SIZE = 64
    EPOCHS = 60
    LR = 0.00001

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    torch.backends.cudnn.benchmark = True
    print("Using device:", device)

    # ======================
    # PATHS
    # ======================
    train_dir = os.path.join(DATA_DIR, "train")
    valid_dir = os.path.join(DATA_DIR, "valid")
    test_dir  = os.path.join(DATA_DIR, "test")

    # ======================
    # TRANSFORMS
    # ======================
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor()
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor()
    ])

    # ======================
    # DATASETS
    # ======================
    train_data = datasets.ImageFolder(train_dir, transform=train_transform)
    valid_data = datasets.ImageFolder(valid_dir, transform=val_transform)
    test_data  = datasets.ImageFolder(test_dir, transform=val_transform)

    train_loader = DataLoader(train_data, batch_size=BATCH_SIZE, shuffle=True, num_workers=4, pin_memory=True)
    valid_loader = DataLoader(valid_data, batch_size=BATCH_SIZE, num_workers=4, pin_memory=True)
    test_loader  = DataLoader(test_data, batch_size=BATCH_SIZE, num_workers=4, pin_memory=True)

    class_names = train_data.classes
    print("Classes:", class_names)

    # ======================
    # MODEL (FINE-TUNING)
    # ======================
    model = models.resnet18(weights="IMAGENET1K_V1")

    # Freeze all layers first
    for param in model.parameters():
        param.requires_grad = False

    # Unfreeze last block
    for param in model.layer4.parameters():
        param.requires_grad = True

    # Replace FC with dropout
    model.fc = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(model.fc.in_features, len(class_names))
    )

    model = model.to(device)

    # ======================
    # LOSS & OPTIMIZER
    # ======================
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=LR)

    # ======================
    # TRAINING
    # ======================
    best_val_acc = 0
    best_model_weights = None

    for epoch in range(EPOCHS):
        model.train()
        train_loss = 0

        for images, labels in tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS}"):
            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()

        # ======================
        # VALIDATION
        # ======================
        model.eval()
        correct = 0
        total = 0

        with torch.no_grad():
            for images, labels in valid_loader:
                images = images.to(device, non_blocking=True)
                labels = labels.to(device, non_blocking=True)

                outputs = model(images)
                _, preds = torch.max(outputs, 1)

                total += labels.size(0)
                correct += (preds == labels).sum().item()

        val_acc = 100 * correct / total

        print(f"\nEpoch [{epoch+1}/{EPOCHS}] "
              f"Loss: {train_loss/len(train_loader):.4f} "
              f"Val Acc: {val_acc:.2f}%")

        # 🔥 STORE BEST MODEL IN MEMORY (NO DISK WRITE)
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            best_model_weights = model.state_dict()

    # ======================
    # SAVE ONLY ONCE
    # ======================
    print("\n💾 Saving best model...")

    torch.save({
        "model_state": best_model_weights,
        "classes": class_names
    }, "best_model.pth")

    print("✅ Best model saved!")

    # ======================
    # TEST
    # ======================
    print("\n🔍 Testing best model...")

    checkpoint = torch.load("best_model.pth")
    model.load_state_dict(checkpoint["model_state"])

    model.eval()
    correct = 0
    total = 0

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)
            _, preds = torch.max(outputs, 1)

            total += labels.size(0)
            correct += (preds == labels).sum().item()

    print(f"✅ Test Accuracy: {100 * correct / total:.2f}%")

# ======================
# WINDOWS FIX
# ======================
if __name__ == "__main__":
    import torch.multiprocessing
    torch.multiprocessing.freeze_support()
    main()