const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const full_name = "john_doe";        
const dob_ddmmyyyy = "17091999";     
const email_id = "john@xyz.com";
const roll_number = "ABCD123";

const to_user_id = () => {
  return `${full_name}_${dob_ddmmyyyy}`;
};

const only_digits = /^[+-]?\d+$/;
const only_alpha = /^[A-Za-z]+$/;

const process_data = (data) => {
    console.log("working")
  const even_numbers = [];
  const odd_numbers = [];
  const alphabets = [];
  const special_characters = [];
  let sum = 0;

  const all_alpha_chars = [];

  for (const raw of data) {
    const item = typeof raw === "string" ? raw : String(raw);

    for (const ch of item) {
      if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) {
        all_alpha_chars.push(ch);
      }
    }

    if (only_digits.test(item)) {
      const num = parseInt(item, 10);
      sum += num;
      if (Math.abs(num) % 2 === 0) {
        even_numbers.push(item);
      } else {
        odd_numbers.push(item);
      }
    } else if (only_alpha.test(item)) {
      alphabets.push(item.toUpperCase());
    } else {
      special_characters.push(item);
    }
  }

  const reversed = all_alpha_chars.reverse();
  const concat_string = reversed
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");

  return {
    even_numbers,
    odd_numbers,
    alphabets,
    special_characters,
    sum: String(sum),
    concat_string,
  };
};

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(200).json({
        is_success: false,
        user_id: to_user_id(),
        email: email_id,
        roll_number: roll_number,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        error: "request body must be { \"data\": [ ... ] }",
      });
    }

    const result = process_data(data);

    return res.status(200).json({
      is_success: true,
      user_id: to_user_id(),
      email: email_id,
      roll_number: roll_number,
      odd_numbers: result.odd_numbers,
      even_numbers: result.even_numbers,
      alphabets: result.alphabets,
      special_characters: result.special_characters,
      sum: result.sum,
      concat_string: result.concat_string,
    });
  } catch (err) {
    return res.status(200).json({
      is_success: false,
      user_id: to_user_id(),
      email: email_id,
      roll_number: roll_number,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: "unexpected server error",
    });
  }
});

const port = 4444;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});