#include <node.h>
#include <nan.h>

#include <new>
#include <string>
#include <vector>

class BaseX : public Nan::ObjectWrap {
 public:
  static NAN_MODULE_INIT(Init) {
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("BaseX").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    Nan::SetPrototypeMethod(tpl, "encode", Encode);
    Nan::SetPrototypeMethod(tpl, "decode", Decode);

    Nan::Set(target, Nan::New("BaseX").ToLocalChecked(), Nan::GetFunction(tpl).ToLocalChecked());
  }

 private:
  uint32_t base;
  uint8_t leader;
  uint8_t* alphabet;

  explicit BaseX(const v8::Local<v8::Value>& data) {
    // data.isString()

    std::string source = std::string(*v8::String::Utf8Value(data->ToString()));

    base = source.length();
    leader = source[0];
    alphabet = new uint8_t[base];
    for (uint32_t i = 0; i < base; ++i) {
      alphabet[i] = source[i];
    }
  }

  ~BaseX() {
    if (alphabet) {
      delete[] alphabet;
    }
  }

  static NAN_METHOD(New) {
    BaseX* obj = new BaseX(info[0]);
    obj->Wrap(info.This());
    info.GetReturnValue().Set(info.This());
  }

  static NAN_METHOD(Encode) {
    Nan::HandleScope scope;

    const unsigned char* buffer = (unsigned char*) node::Buffer::Data(info[0]);
    size_t blength = node::Buffer::Length(info[0]);

    BaseX* obj = Nan::ObjectWrap::Unwrap<BaseX>(info.Holder());

    std::vector<uint32_t> digits = {0};
    for (size_t i = 0; i < blength; ++i) {
      uint32_t carry = (digits[0] << 8) + buffer[i];
      digits[0] = carry % obj->base;
      carry /= obj->base;

      for (size_t j = 1; j < digits.size(); ++j) {
        carry += digits[j] << 8;
        digits[j] = carry % obj->base;
        carry /= obj->base;
      }

      while (carry > 0) {
        digits.push_back(carry % obj->base);
        carry = carry / obj->base;
      }
    }

    for (size_t i = 0; buffer[i] == 0 && i < blength; ++i) {
      digits.push_back(0);
    }

    std::string str;
    str.reserve(digits.size());
    for (size_t i = 0; i < digits.size(); ++i) {
      str[i] = obj->alphabet[digits[i]];
    }

    v8::Local<v8::Object> result = Nan::CopyBuffer((const char*) str.c_str(), digits.size()).ToLocalChecked();
    info.GetReturnValue().Set(result);
  }

  static NAN_METHOD(Decode) {}
};

NODE_MODULE(basex, BaseX::Init)
