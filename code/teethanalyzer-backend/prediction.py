import torch
from torchvision import transforms
from PIL import Image
import timm
import io

class_names = ['Calculus', 'Dental Caries', 'Gingivitis', 'Hypodontia', 'Mouth Ulcer', 'Tooth Discoloration']
MODEL_PATH = "inception_resnet_v2_oral_disease_classifier.pth"

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Build the same InceptionResNetV2 model
def build_model(num_classes):
    model = timm.create_model('inception_resnet_v2', pretrained=False, num_classes=num_classes)
    return model

model = build_model(num_classes=len(class_names))
model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
model.eval()

async def predict_disease(file):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert('RGB')  # Make sure it's RGB
    image_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(image_tensor)
        _, predicted = torch.max(outputs, 1)
        predicted_class = class_names[predicted.item()]
    return predicted_class
