# Ray is responsible for setting up the tokenizer
import torch
from datasets import load_dataset
from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments, DataCollatorForLanguageModeling

# Ray: Load tokenizer
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
tokenizer.add_special_tokens({'pad_token': '[PAD]'})

# Atharva is in charge of model setup and preparation for GPU
# Atharva: Load model and move to GPU
model = GPT2LMHeadModel.from_pretrained("gpt2")
model.resize_token_embeddings(len(tokenizer))
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

# Aylin is handling the dataset loading and preprocessing
# Aylin: Load dataset
dataset = load_dataset("imdb")
train_dataset = dataset['train'].shuffle(seed=42).select(range(2000))
eval_dataset = dataset['test'].shuffle(seed=42).select(range(500))

# Ray: Tokenize function
def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=120)

# Aylin: Tokenize datasets
train_dataset = train_dataset.map(tokenize_function, batched=True)
eval_dataset = eval_dataset.map(tokenize_function, batched=True)

# Aylin: Format datasets for PyTorch
train_dataset.set_format(type='torch', columns=['input_ids', 'attention_mask'])
eval_dataset.set_format(type='torch', columns=['input_ids', 'attention_mask'])

# Atharva: Define training arguments
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    logging_steps=10,
    save_steps=10,
    evaluation_strategy="steps",
    eval_steps=10,
    save_total_limit=2,
    fp16=True,  # Enable mixed precision training
)

# Ray: Data collator
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

# Atharva: Create Trainer instance
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    data_collator=data_collator,
)

# Atharva: Fine-tune model
trainer.train()

# Ray: Save the model weights
model.save_pretrained("./results")
tokenizer.save_pretrained("./results")

# Aylin: Prompt for generation
prompt = "This movie was absolutely amazing because"

# Aylin: Encode the input
input_ids = tokenizer.encode(prompt, return_tensors="pt").to(device)

# Aylin: Generate text
output = model.generate(input_ids, max_length=150, num_beams=5, temperature=0.7, no_repeat_ngram_size=2, early_stopping=True)

# Aylin: Decode the output
generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
print(generated_text)
